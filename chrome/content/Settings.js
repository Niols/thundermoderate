// chrome://thundermoderate/content/settings.js

// Dependencies:
// - chrome://global/content/nsUserSettings.js
// - chrome://thundermoderate/content/WebmodoAPI.js

var Settings = {

    onOK: function()
    {
	var token = document.getElementById('thundermoderate-settings-token').value;
	nsPreferences.setUnicharPref('thundermoderate.token', token);
    },

    onLoad: function()
    {
	var tokenInput = document.getElementById('thundermoderate-settings-token');
	tokenInput.value = nsPreferences.copyUnicharPref('thundermoderate.token', '');
    }

}
