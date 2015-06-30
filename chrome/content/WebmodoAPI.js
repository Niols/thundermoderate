// chrome://thundermoderate/content/WebmodoAPI.js

// Dependencies:
// - chrome://global/content/nsUserSettings.js

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
	
	req.send( body );
    },

    getMailStatus: function( cookie , callback )
    {
	WebmodoAPI.sendRequest( 'GET',
				'mails/'+cookie+'?format=json',
				null,
				function (mail) { callback ( mail.status ); } );
    },

    setMailStatus: function( cookie , status , callback )
    {
	WebmodoAPI.sendRequest( 'PATCH',
				'mails/'+cookie+'?format=json',
				'{"status": "'+status+'"}',
				callback );
    }

};
