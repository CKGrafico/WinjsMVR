(function (global, $, _, languages) {
    'use strict';

    // Router Class
    App.Models.Animals = WinJS.Class.extend(WinjsMVR.Model,



        // Instance Members
        {
            attributes: {
                url: 'http://adopta.azurewebsites.net',
                p: 0
            },

            events: {
                'collectionAdd': 'onCollectionAdd'
            },

            getAnimals: function () {
                var tags = this.get('tags');

                if (tags) {
                    debugger;
                    this.getJSON({
                        path: this.get('path') || '',
                        tags:  tags,
                        p: this.get('p') || 0,
                        async: true,
                        lang: languages.getLanguage().substring(0, 2)
                    });
                }else{
                    this.getJSON({
                        path: this.get('path') || '',
                        p: this.get('p') || 0,
                        async: true,
                        lang: languages.getLanguage().substring(0, 2)
                    });
                }
            },

            changeFilters: function () {
                var filters = this.get('filters');
                var state = {perros: null, gatos: null, machos: null, hembras:null};
                _.each(filters, function (filter) {
                    state[filter.id] = filter.selected;
                });
                if (state.perros && state.gatos || !state.perros && !state.gatos) {
                    this.set('path', 'animales_en_adopcion');
                } else if (state.perros) {
                    this.set('path', 'perros_en_adopcion');
                } else if (state.gatos) {
                    this.set('path', 'gatos_en_adopcion');
                }

                if (state.machos && state.hembras || !state.machos && !state.hembras) {
                    this.set('tags', '');
                } else if (state.machos) {
                    this.set('tags', 'macho');
                } else if (state.hembras) {
                    this.set('tags', 'hembra');
                }
                
            },

            onCollectionAdd: function () {
                this.collection.pop();
            }


        }
    );

})(window, jQuery, _, window.languages);