(function (global, $, _, languages, t, toast) {
    'use strict';

    // Router Class
    App.Views.Langs = WinJS.Class.extend(WinjsMVR.View,

        // Instance Members
        {
            domEvents: {
                'click .lang-tab': 'onClickLang'
            },

            idName: 'langs',
            templateName: 'langs',

            dom: {
                langTab: '.lang-tab'
            },


            render: function () {
                this.$el.html(this.template(this.options));
                return this;
            },

            onClickLang: function (e) {

                    var $current = $(e.currentTarget);
                    var id = $current.data('id');
                    var self = this;
                    _.each(this.options.langs, function (lang) {
                        lang.selected = !lang.selected;
                        if (lang.id === id) {
                            languages.setLanguage(lang.id);
                        }
                    });

                    $(this.dom.langTab).toggleClass('selected');

                    toast.show({ title: t('El cambio se hará efectivo al reiniciar la aplicación') });
                
            }

        }
    );

})(window, jQuery, _, window.languages, window.translate, YeahToast);