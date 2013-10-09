(function (global, $, _) {
    'use strict';

    // Router Class
    App.Views.Filters = WinJS.Class.extend(WinjsMVR.View,

        // Instance Members
        {
            domEvents: {
                'click .filter-tab': 'onClickFilter'
            },

            events: {
                'changeFilter': 'onChangeFilter'
            },

            idName: 'filters_tab',
            templateName: 'filters',
            filters: [],

            dom: {
                filtertab: '.filter-tab'
            },

            render: function () {
                this.$el.html(this.template(this.options));
                return this;
            },

            onClickFilter: function (e) {
                var $current = $(e.currentTarget);
                var id = $current.data('id');
                var self = this;
                _.each(this.options.filters, function (filter) {

                    if (filter.id === id) {
                        filter.selected = !filter.selected;
                        self.trigger('changeFilter', filter);
                    }
                });


                $current.toggleClass('selected');

                //despues de todo esto miro se han hecho algo raro que cutre es esto..
                // if (!$('#animals-perros').hasClass('selected') && !$('#animals-gatos').hasClass('selected')) {
                //     $('#animals-perros').addClass('selected');
                //     $('#animals-gatos').addClass('selected');

                //     _.each(this.options.filters, function (filter) {

                //         if (filter.id === 'perros' || filter.id === 'gatos') {
                //             filter.selected = !filter.selected;
                //         }
                //     });
                // }

                // if (!$('#animals-machos').hasClass('selected') && !$('#animals-hembras').hasClass('selected')) {
                //     $('#animals-machos').addClass('selected');
                //     $('#animals-hembras').addClass('selected');
                //     _.each(this.options.filters, function (filter) {

                //         if (filter.id === 'machos' || filter.id === 'hembras') {
                //             filter.selected = !filter.selected;
                //         }
                //     });
                // }
            },

            getFilter: function(id) {
                return _.find(this.options.filters, function(filter) {
                    return filter.id === id;
                });
            },

            onChangeFilter: function(filter) {
                var filters = this.options.filters;
                if(!this.getFilter('perros').selected && !this.getFilter('gatos').selected) {
                    this.toggleFilter(this.getFilter('perros'));
                    this.toggleFilter(this.getFilter('gatos'));
                }

                if(!this.getFilter('perros').selected && !this.getFilter('hembras').selected) {
                    this.toggleFilter(this.getFilter('perros'));
                    this.toggleFilter(this.getFilter('hembras'));
                }
            },

            toggleFilter: function(filter) {
                filter.selected = !filter.selected;
                $('#animals-' + filter.id).toggleClass('selected');

            }

        }
    );

})(window, jQuery, _);