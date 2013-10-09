(function (global, $, tools) {
    'use strict';

    // Router Class
    App.Views.Home = WinJS.Class.extend(WinjsMVR.View,

        // Instance Members
        {
            idName: 'home',

            events: {
                'header/changeFilter': 'onChangeFilter',
                'content/clickAnimal': 'onClickAnimal'
            },

            dom: {
                loading: '.loadmore'
            },

            initialize: function () {
                this.header = new App.Views.Header();
                this.content = new App.Views.List({ filters: this.header.filtersArray });
                this.single = new App.Views.Single();

               // this.content.on('clickAnimal', this.onClickAnimal, this);
            },

            render: function () {
                this.$el.html('');
                this.$el.append(this.header.render().$el);
                this.$el.append(this.content.render().$el);
                this.$el.append(this.single.render({}).$el);

                return this;
            },

            onChangeFilter: function (filter) {
                this.content.changeFilter(filter.detail);
            },

            onClickAnimal: function (animal) {
                this.single.getAnimal(animal.detail);
            }

        }
    );

})(window, jQuery, WinjsMVR.Tools);