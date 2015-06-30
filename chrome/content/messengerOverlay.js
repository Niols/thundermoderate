// chrome://thundermoderate/content/messengerOverlay.js

token = '';

function getWebmodoRequest( url , async )
{
    xmlHttp.open( 'GET',
		  'http://blogs.eleves.ens.fr/webmoderation/api/' + url,
		  async );

    xmlHttp.setRequestHeader( 'Authorization',
			      'Token ' + token )

    return xmlHttp;
}

function getMail( cookie, callback=false )
{
    var xmlHttp = getWebmodoRequest( 'mails/'+cookie+'?format=json', !!callback );

    if( !!callback )
    {
	xmlHttp.onreadystatechange = function () {
	    if(xmlHttp.readyState == 4)
		callback ( JSON.parse ( xmlHttp.responseText ) ); 
	}
    }
    
    xmlHttp.send( null );

    if( !callback )
	return JSON.parse( xmlHttp.responseText );
}

function status2text( status )
{
    switch( status )
    {
	case 'transmis': text = 'transmitted'; break;
	case 'ignoré':   text = 'ignored';     break;
	case 'publié':   text = 'published';   break;
	case 'refusé':   text = 'denied';      break;
	default:         text = 'error';
    }

    return '&thundermoderate.'+text+';';
}





var messengerOverlayEvents = {

    mail_cookie : false,

    onLoad: function() {
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
        var messagepane = document.getElementById("messagepane");
        if(messagepane)
            messagepane.addEventListener("load", messengerOverlayEvents.updateButtons, true);
        window.addEventListener("activate", messengerOverlayEvents.updateButtons, true);
        this.initialized = true;
    },
    
    updateButtons: function() {
        if(!gFolderDisplay)
            return;

        var msg = gFolderDisplay.selectedMessage;
        if(!msg)
            return;

        var tm_separator = document.getElementById("thundermoderate-toolbar-separator");
        var tm_moderate  = document.getElementById("thundermoderate-toolbar-moderate");
        var tm_menu      = document.getElementById("thundermoderate-toolbar-menu");

        if( (!tm_separator) || (!tm_moderate) || (!tm_menu) )
            return;

        var subject = msg.mime2DecodedSubject;
        var re = /moderate ([0-9A-F]{8}) \(([a-z0-9]*)\)/g;
        matches = re.exec(subject);   
	
        if(!matches)
        {
	    tm_separator.hidden = true;
	    tm_moderate.hidden = true;
	    tm_menu.hidden = true;
            messengerOverlayEvents.currentCookie = false;
        }
        else
        {
	    cookie = matches[1];

	    tm_moderate.label = '&thundermoderate.moderate;';
	    tm_menu.label = '&thundermoderate.loading;';

	    tm_separator.hidden = false;
	    tm_moderate.hidden = false;
	    tm_menu.hidden = false;

            messengerOverlayEvents.mail_cookie = cookie;

	    // Asynchronous because we don't want to block thunderbird
	    mail = getMail( cookie, function (mail) { tm_menu.label = status2text( mail.status ); } );
        }
    }

};

window.addEventListener("load", function(e) { messengerOverlayEvents.onLoad(e); }, false);

