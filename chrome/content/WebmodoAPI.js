// chrome://thundermoderate/content/WebmodoAPI.js

// Dependencies:
// - chrome://global/content/nsUserSettings.js

function status_thundermoderate_to_webmodo( status )
{
    switch( status )
    {
    case 'transmitted':  return 'transmis';
    case 'ignored':      return 'ignoré';
    case 'published':    return 'publié';
    case 'denied':       return 'refusé';
    case 'notmoderated': return null;
    default:             return false;
    }
}

function status_webmodo_to_thundermoderate( status )
{
    switch( status )
    {
    case 'transmis': return 'transmitted';
    case 'ignoré':   return 'ignored';
    case 'publié':   return 'published';
    case 'refusé':   return 'denied';
    case null:       return 'notmoderated';
    default:         return 'error';
    }
}



var WebmodoAPI = {
    
    getToken: function()
    {
	var token = nsPreferences.copyUnicharPref('thundermoderate.token', '');

	if( !token && !WebmodoAPI.getToken.noTokenWarning )
	{
	    WebmodoAPI.getToken.noTokenWarning = true;
	    alert('ThunderModerate:\nYou are trying to access to the Webmodo API without token.\nPlease go in the preferences of this add-on and give this information.');
	}

	return token;
    },

    sendRequest: function( method , url , body , callback )
    {
	var req = new XMLHttpRequest;
	
	req.open( method,
		  'http://blogs.eleves.ens.fr/webmoderation/api/' + url,
		  true );
	
	req.setRequestHeader( 'Authorization',
			      'Token ' + WebmodoAPI.getToken() );
	
	req.setRequestHeader( 'Content-Type',
			      'application/json' );
	
	req.onreadystatechange = function () {
	    if( req.readyState == 4 )
		callback ( JSON.parse ( req.responseText ) );
	}
	
	req.send( JSON.stringify ( body ) );
    },

    getMail: function( cookie , callback )
    {
	WebmodoAPI.sendRequest( 'GET',
				'mails/'+cookie+'?format=json',
				null,
				callback );
    },

    getMailStatus: function( cookie , callback )
    {
	WebmodoAPI.getMail( cookie ,
			    function (mail) {
				callback ( status_webmodo_to_thundermoderate ( mail.status ) , mail['moderated-by'] ); // must replace by mail.moderated-by but it's not working
			    } );
    },

    setMailStatus: function( cookie , status , callback )
    {
	WebmodoAPI.sendRequest( 'PATCH',
				'mails/'+cookie+'?format=json',
				{'status': status_thundermoderate_to_webmodo ( status )},
				callback );
    }

};
