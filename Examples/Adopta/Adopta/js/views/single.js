(function (global, $, _, tools) {
    'use strict';

    // Router Class
    App.Views.Single = WinJS.Class.extend(WinjsMVR.View,

        // Instance Members
        {
            idName: 'ficha',
            className: 'hide',
            templateName: 'single',
            model: App.Models.Animal,
 
            domEvents: {
                'click #close': 'reset'
            },

            events: {
                'model/collection.Fill': 'onFilla'
            },

            render: function (animal) {
                this.$el.html(this.template(animal));
                $('#fichafondo').remove();
                this.$el.after($('<div/>').attr('id', 'fichafondo'));
                return this;
            },

            toggle: function () {               
                this.$el.toggleClass('hide');
            },

            reset: function () {
                this.toggle();
                $('#fichafondo').remove();
            },

            getAnimal: function (animal) {
                tools.toggleLoading('fade');
                this.model.getAnimal(animal.a);
            },

            onFilla: function (animal) {
                tools.toggleLoading('fade');
                this.render(animal.detail[0]);
                this.toggle();
            }

        }
    );

})(window, jQuery, _, WinjsMVR.Tools);