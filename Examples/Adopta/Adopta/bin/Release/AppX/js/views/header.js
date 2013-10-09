(function (global, $, _, t, languages) {
    'use strict';

    // Router Class
    App.Views.Header = WinJS.Class.extend(WinjsMVR.View,



        // Instance Members
        {
            idName: 'header',
            templateName: 'header',

            initialize: function () {
                this.filtersArray = [
                    { id: 'perros', name: t('Perros'), selected: true},
                    { id: 'gatos', name: t('Gatos'), selected: true },
                    { id: 'machos', name: t('Machos'), selected: true },
                    { id: 'hembras', name: t('Hembras'), selected: true }
                ];
                this.filters = new App.Views.Filters({ filters: this.filtersArray });

                var currentLang = languages.getLanguage();
                this.languagesArray = [
                    { id: 'es-ES', name: t('Castellano'), selected: (currentLang === 'es-ES') ? true : false },
                    { id: 'ca-ES', name: t('Catalán'), selected: (currentLang === 'ca-ES') ? true : false }
                ];
                this.languages = new App.Views.Langs({ langs: this.languagesArray });
            },

            render: function () {
                this.$el.html(this.template());
                this.$el.append(this.filters.render().$el);
                this.$el.append(this.languages.render().$el);
 
                return this;
            }

        }
    );

})(window, jQuery, _, window.translate, window.languages);