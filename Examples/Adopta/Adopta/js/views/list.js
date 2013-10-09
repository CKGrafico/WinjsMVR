(function (global, $, _, languages, tools) {
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
            first: true,
            count: 0,

            domEvents: {
                'click #viewmore': 'loadMore',
                'click .animal': 'onClickAnimal'
            },

            events: {
                'model/collection.Fill': 'moreLoaded'
            },

            dom: {
                viewmore: '#viewmore'
            },

            initialize: function () {
                tools.toggleLoading('fade');
                this.model.set('filters', this.options.filters);
                this.model.changeFilters();
                this.model.getAnimals();
            },

            loadMore: function (e) {
                if (!this.first) {
                    tools.toggleLoading('fade');
                }
                this.model.set('p', this.model.get('p') + 1);
                this.model.getAnimals()
            },

            moreLoaded: function (data) {
                $(this.dom.viewmore).remove();
                var newAnimals = data.detail;
                newAnimals.pop();

                if (this.first) {
                    this.$el.html('');
                }

                this.$el.append(this.template({ animals: newAnimals }));

                // La primera vez
                if (this.first) {
                    this.loadMore();
                    this.first = false;
                    this.count = 1;
                } else {
                    if (this.count > 1) {
                        this.$el.animate({ scrollLeft: this.$el.scrollLeft() + 600 }, 400);
                    }
                    this.count = 2;
                    tools.toggleLoading('fade');
                }
            },

            changeFilter: function (filter) {
                tools.toggleLoading('fade');
                this.reset();
                this.model.onChangeFilter(filter);
            },

            onClickAnimal: function (e) {
                var id = $(e.currentTarget).data('id');
                this.trigger('clickAnimal', this.model.getOfCollection(id));
            },

            reset: function () {
                this.first = true;
                this.count = 0;
            }

        }
    );

})(window, jQuery, _, window.languages, WinjsMVR.Tools);