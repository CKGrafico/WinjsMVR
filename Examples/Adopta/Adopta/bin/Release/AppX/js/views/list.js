(function (global, $, _, languages) {
    'use strict';

    // Router Class
    App.Views.List = WinJS.Class.extend(WinjsMVR.View,



        // Instance Members
        {
            idName: 'list',
            tagName: 'article',
            className: 'group list',
            model: App.Models.Animals,
            templateName: 'list',
            defmax: 600,
            max: 600,

            domEvents: {
                'click #viewmore': 'loadMore'
            },

            events: {
                'addToCollectionAll': 'moreLoaded',
                'resetCollection': 'onReset'
            },

            dom: {
                loading: '.loadmore'
            },

            initialize: function () {
                this.model.set('filters', this.options.filters);
                this.model.changeFilters();
                $(this.dom.loading).show();
                this.model.getAnimals();
            },

            render: function () {
                this.$el.html('');
                return this;
            },

            loadMore: function (e) {
                $(this.dom.loading).show();
                var $current = $(e.currentTarget);
                $current.remove();
                this.model.set('p', this.model.get('p') + 1);
                this.model.getAnimals()
            },

            moreLoaded: function (newAnimals) {
                debugger;
              //  $(this.dom.loading).hide();
              //  this.$el.append(this.template({ animals: newAnimals }));
            },

            changeFilter: function (filter) {
                this.model.resetCollection();
                $(this.dom.loading).show();
                this.model.set('p', 0);
                this.model.set('filters', _.extend(this.options.filters, filter));
                this.model.changeFilters();
                this.model.getAnimals();
            },

            onReset: function () {
                this.$el.html('');
            }

        }
    );

})(window, jQuery, _, window.languages);