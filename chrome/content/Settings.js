// chrome://thundermoderate/content/settings.js

// Dependencies:
// - chrome://global/content/nsUserSettings.js
// - chrome://thundermoderate/content/WebmodoAPI.js

var Settings = {

    onOK: function()
    {
	var token = document.getElementById('thundermoderate-settings-token').value;
	nsPreferences.setUnicharPref('thundermoderate.token', token);

	var showModeratorInButton = document.getElementById('thundermoderate-settings-moderator-showinbutton').checked;
	nsPreferences.setBoolPref('thundermoderate.moderator.showinbutton', showModeratorInButton);
    },

    onLoad: function()
    {
	var tokenInput = document.getElementById('thundermoderate-settings-token');
	tokenInput.value = nsPreferences.copyUnicharPref('thundermoderate.token', '');

	var showModeratorInButtonInput = document.getElementById('thundermoderate-settings-moderator-showinbutton');
	showModeratorInButtonInput.checked = nsPreferences.getBoolPref('thundermoderate.moderator.showinbutton', false);
    }

}
