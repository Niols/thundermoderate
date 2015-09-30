// chrome://thundermoderate/content/MessengerOverlay.js

// Dependencies:
// - chrome://thundermoderate/content/WebmodoAPI.js

function T_( text )
{
    var strbundle = document.getElementById( 'strings' );
    return strbundle.getString( text );
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

        var tm_menu     = document.getElementById('thundermoderate-toolbar-menu');
	var tm_ignore   = document.getElementById('thundermoderate-toolbar-ignore');
	var tm_deny     = document.getElementById('thundermoderate-toolbar-deny');
	var tm_publish  = document.getElementById('thundermoderate-toolbar-publish');
	var tm_transmit = document.getElementById('thundermoderate-toolbar-transmit');
	var tm_cancel   = document.getElementById('thundermoderate-toolbar-cancel');

        if( (!tm_menu) || (!tm_ignore) || (!tm_deny) || (!tm_publish) || (!tm_transmit) || (!tm_cancel) )
            return;

        var subject = msg.mime2DecodedSubject;
        var re = /moderate ([0-9A-F]{8}) \(([a-z0-9]*)\)/g;
        matches = re.exec(subject);

        if(!matches)
        {
	    tm_menu.hidden = true;
	    tm_menu.type = '';
	    tm_ignore.hidden = true;
	    tm_deny.hidden = true;
	    tm_publish.hidden = true;
	    tm_transmit.hidden = true;
	    tm_cancel.hidden = true;

            MessengerOverlay.cookie = false;
        }
        else
        {
	    cookie = matches[1];

	    tm_menu.label = T_('loading');
	    tm_menu.type = '';
	    tm_ignore.hidden = true;
	    tm_deny.hidden = true;
	    tm_publish.hidden = true;
	    tm_transmit.hidden = true;
	    tm_cancel.hidden = true;
	    tm_menu.hidden = false;

            MessengerOverlay.cookie = cookie;

	    WebmodoAPI.getMailStatus( cookie, function (status, moderator) {
		tm_menu.label = T_(status);
		if( status == 'error' )
		{
		    tm_menu.tooltipText = '';
		}
		else
		{
		    if (status == 'notmoderated')
		    {
			tm_menu.tooltiptext = '';
			tm_ignore.hidden = false;
			tm_deny.hidden = false;
			tm_publish.hidden = false;
			tm_transmit.hidden = false;
			tm_cancel.hidden = true;
		    }
		    else
		    {
			if( nsPreferences.getBoolPref('thundermoderate.moderator.showinbutton', false) )
			    tm_menu.label += ' (' + moderator + ')';
			tm_menu.tooltipText = T_('moderatedby') + ' ' + moderator;
			tm_ignore.hidden = true;
			tm_deny.hidden = true;
			tm_publish.hidden = true;
			tm_transmit.hidden = true;
			tm_cancel.hidden = false;
		    }
		    tm_menu.type = 'menu-button';
		}
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
	MessengerOverlay.set_status( 'ignored' );
    },

    deny: function()
    {
	MessengerOverlay.set_status( 'denied' );
    },

    publish: function()
    {
	MessengerOverlay.set_status( 'published' );
    },

    transmit: function()
    {
	MessengerOverlay.set_status( 'transmitted' );
    },

    cancel: function()
    {
	MessengerOverlay.set_status( 'notmoderated' );
    }

};

window.addEventListener("load",
			function(e) { MessengerOverlay.onLoad(e); },
			false);
