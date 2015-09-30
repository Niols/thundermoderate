// chrome://thundermoderate/content/MessengerOverlay.js

// Dependencies:
// - chrome://thundermoderate/content/WebmodoAPI.js

function T_( text )
{
    var strbundle = document.getElementById( 'strings' );
    return strbundle.getString( text );
}

function show_btn ( btn ) { btn.hidden = false; }
function hide_btn ( btn ) { btn.hidden = true;  }

var MessengerOverlay = {

    cookie : false,

    onLoad: function()
    {
        Components.utils.import('resource://gre/modules/FileUtils.jsm');

        var messagepane = document.getElementById('messagepane');
        if(messagepane)
            messagepane.addEventListener(
		'load',
		MessengerOverlay.update,
		true);

        window.addEventListener(
	    'activate',
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

        var btn_loading      = document.getElementById('thundermoderate-toolbar-loading'     );
        var btn_error        = document.getElementById('thundermoderate-toolbar-error'       );
	var btn_ignored      = document.getElementById('thundermoderate-toolbar-ignored'     );
	var btn_denied       = document.getElementById('thundermoderate-toolbar-denied'      );
	var btn_published    = document.getElementById('thundermoderate-toolbar-published'   );
	var btn_transmitted  = document.getElementById('thundermoderate-toolbar-transmitted' );
	var btn_notmoderated = document.getElementById('thundermoderate-toolbar-notmoderated');

        if( (! btn_loading) || (! btn_error) || (! btn_ignored) || (! btn_denied) || (! btn_published) || (! btn_transmitted) || (! btn_notmoderated))
            return;

        var subject = msg.mime2DecodedSubject;
        var re = /moderate ([0-9A-F]{8}) \(([a-z0-9]*)\)/g;
        matches = re.exec(subject);

        if(!matches)
        {
	    hide_btn( btn_loading      );
	    hide_btn( btn_error        );
	    hide_btn( btn_ignored      );
	    hide_btn( btn_denied       );
	    hide_btn( btn_published    );
	    hide_btn( btn_transmitted  );
	    hide_btn( btn_notmoderated );

            MessengerOverlay.cookie = false;
        }
        else
        {
	    cookie = matches[1];

	    show_btn( btn_loading      );

	    hide_btn( btn_error        );
	    hide_btn( btn_ignored      );
	    hide_btn( btn_denied       );
	    hide_btn( btn_published    );
	    hide_btn( btn_transmitted  );
	    hide_btn( btn_notmoderated );

            MessengerOverlay.cookie = cookie;

	    WebmodoAPI.getMailStatus( cookie, function (status, moderator) {

		hide_btn( btn_loading );

		if ( status == 'error' )
		{
		    show_btn( btn_error );
		}
		else if ( status == 'notmoderated' )
		{
		    show_btn( btn_notmoderated );
		}
		else
		{
		    tooltipText = T_('moderatedby') + ' ' + moderator;
		    switch (status)
		    {
			case 'ignored':
			show_btn( btn_ignored     );
			btn_ignored.tooltipText     = tooltipText;
			break;

			case 'published':
			show_btn( btn_published   );
			btn_published.tooltipText   = tooltipText;
			break;

			case 'denied':
			show_btn( btn_denied      );
			btn_denied.tooltipText      = tooltipText;
			break;

			case 'transmitted':
			show_btn( btn_transmitted );
			btn_transmitted.tooltipText = tooltipText;
			break;
		    }
		}
	    } );
        }
    },

    set_status: function( status )
    {
	if( MessengerOverlay.cookie )
	    WebmodoAPI.setMailStatus(
		MessengerOverlay.cookie ,
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

window.addEventListener(
    'load',
    function(e) { MessengerOverlay.onLoad(e); },
    false);
