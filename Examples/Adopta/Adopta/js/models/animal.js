(function (global, $, _, languages) {
    'use strict';

    // Router Class
    App.Models.Animal = WinJS.Class.extend(WinjsMVR.Model,

        // Instance Members
        {
            attributes: {
                url: 'http://adopta.azurewebsites.net/single.php'
            },

            events: {
              //  'collectionAdd': 'onCollectionAdd'
            },

            getAnimal: function (url, callback) {
                this.getJSON({
                    url: url,
                    async: true,
                    lang: languages.getLanguage().substring(0, 2)
                }, callback);
            }


        }
    );

})(window, jQuery, _, window.languages);