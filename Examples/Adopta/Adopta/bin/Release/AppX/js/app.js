(function (global, $, _, languages, t) {
    'use strict';

    var applicationData = Windows.Storage.ApplicationData.current;
    var roamingSettings = applicationData.roamingSettings;

    global.App = {
        Views: {},
        Models: {},

        start: function (view) {
            this.router = new WinjsMVR.Router({ wrapper: '#wrapper' });
            this.router.addPage(view, new this.Views[view]);
            this.router.navigate(view);
        }


    };
})(window, jQuery, _);