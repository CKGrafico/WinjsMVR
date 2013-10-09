/*
    WinJS MVR a simple library to do better and easy apps in Windows 8 with WinJS
    Inspired in Backbone but more simple and oriented to WinJS
    author: @CKGrafico
    version: 0.1
*/


(function (global, $, _) {

    'use strict';
    var applicationData = Windows.Storage.ApplicationData.current;
    var roamingSettings = applicationData.roamingSettings;
    var resourceContext = Windows.ApplicationModel.Resources.Core.ResourceContext.getForCurrentView();

    //Language Class
    var Languages = WinJS.Class.define(
        // Constructor
        function () {
            this.setLanguage(roamingSettings.values['AppLanguage'] || resourceContext.languages[0] || 'en-US');
        }, 

        // Instance Members
        {
            translate: function (string) {
                var translated = WinJS.Resources.getString(string);
                if (!translated.empty) {
                    return translated.value;
                }
                return '*' + string;
            },

            setLanguage: function (language) {
                
                Windows.Globalization.ApplicationLanguages.primaryLanguageOverride = language;
                roamingSettings.values['AppLanguage'] = language;
                this.language = language;
            },

            getLanguage: function () {
                return this.language;
            }

        }
    );

    global.languages = new Languages();
    global.translate = languages.translate;

    Handlebars.registerHelper('i18n', translate);


})(window, jQuery, _);