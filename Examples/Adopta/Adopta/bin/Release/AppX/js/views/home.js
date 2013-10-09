(function (global, $, _) {
    'use strict';

    // Router Class
    App.Views.Home = WinJS.Class.extend(WinjsMVR.View,

        // Instance Members
        {
            idName: 'home',

            events: {
                'changeFilter': 'onChangeFilter'
            },

            dom: {
                loading: '.loadmore'
            },

            initialize: function () {
                $(this.dom.loading).hide();
                this.header = new App.Views.Header();
                this.content = new App.Views.List({ filters: this.header.filtersArray });
            },

            render: function () {
                this.$el.html('');
                this.$el.append(this.header.render().$el);
                this.$el.append(this.content.render().$el);
                return this;
            },

            onChangeFilter: function (filter) {
                this.content.changeFilter(filter);
            }

        }
    );

})(window, jQuery, _);