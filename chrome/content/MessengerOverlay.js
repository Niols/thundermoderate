// chrome://thundermoderate/content/MessengerOverlay.js

// Dependencies:
// - chrome://thundermoderate/content/WebmodoAPI.js

function T_( text )
{
    var strbundle = document.getElementById( 'strings' );
    return strbundle.getString( text );
}

function status2text( status )
{
    switch( status )
    {
    case 'transmis': text = 'transmitted';  break;
    case 'ignoré':   text = 'ignored';      break;
    case 'publié':   text = 'published';    break;
    case 'refusé':   text = 'denied';       break;
    case null:       text = 'notmoderated'; break;
    default:         text = 'error';
    }
    
    return T_(text);
}

var MessengerOverlay = {
    
    cookie : false,
    
    onLoad: function()
    {
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
	
        var messagepane = document.getElementById("messagepane");
        if(messagepane)
            messagepane.addEventListener("load",
					 MessengerOverlay.update,
					 true);
	
        window.addEventListener("activate",
				MessengerOverlay.update,
				true);
	
        this.initialized = true;
    },
    
    update: function()
    {
        if(!gFolderDisplay)
            return;

        var msg = gFolderDisplay.selectedMessage;
        if(!msg)
            return;

        var tm_separator = document.getElementById('thundermoderate-toolbar-separator');
        var tm_moderate  = document.getElementById('thundermoderate-toolbar-moderate');
        var tm_menu      = document.getElementById('thundermoderate-toolbar-menu');

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
            MessengerOverlay.cookie = false;
        }
        else
        {
	    cookie = matches[1];

	    tm_moderate.label = T_('moderate');
	    tm_menu.label = T_('loading');

	    tm_separator.hidden = false;
	    tm_moderate.hidden = false;
	    tm_menu.hidden = false;

            MessengerOverlay.cookie = cookie;

	    WebmodoAPI.getMailStatus( cookie,
				      function (status) {
					  tm_menu.label = status2text( status );
				      } );
        }
    },

    set_status: function( status )
    {
	if( MessengerOverlay.cookie )
	    WebmodoAPI.setMailStatus( MessengerOverlay.cookie ,
				      status ,
				      function (x) { MessengerOverlay.update(); } );
    },

    ignore: function()
    {
	MessengerOverlay.set_status( 'ignoré' );
    },

    deny: function()
    {
	MessengerOverlay.set_status( 'refusé' );
    },

    publish: function()
    {
	MessengerOverlay.set_status( 'publié' );
    },

    transmit: function()
    {
	MessengerOverlay.set_status( 'transmis' );
    }

};

window.addEventListener("load",
			function(e) { MessengerOverlay.onLoad(e); },
			false);
