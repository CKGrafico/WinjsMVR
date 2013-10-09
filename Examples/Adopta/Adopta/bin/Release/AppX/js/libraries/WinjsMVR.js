/*
    WinJS MVR a simple library to do better and easy apps in Windows 8 with WinJS
    Inspired in Backbone but more simple and oriented to WinJS
    author: @CKGrafico
    version: 0.1
*/


(function (global, $, _) {

    'use strict';

    //Base Class
    var Base = WinJS.Class.define(
        // Constructor
        function () { }, // It's always overwritted

        // Instance Members
        {
            // Only called by WinJSMVR Classes (View, Model, Router)
            baseConstructor: function (context) {
                var self = context;

                // Prepare custom events
                _.each(self.events, function (value, key) {
                    var split = key.split(' ');
                    var event = split[0];
                    var element = split[1] || null;

                    self.on(event, _.bind(self[value], self));
                });
            },

            options: {},

            events: {},

            initialize: function () { },

            trigger: function (event, options) { // Trigger an event
                var data = { type: event };
                _.extend(data, options);
                WinJS.Application.queueEvent(data);
            },

            on: function (event, callback) { // Subscribe to event
                WinJS.Application.addEventListener(event, callback); // TO DO no only global events?
            }

        }
    );

    // Views Class
    var View = WinJS.Class.derive(

        Base, // Parent Class

        // Constructor
        function (options) {
            this.customConstructor(options);
        },

        // Instance Members
        {

            customConstructor: function (options) {
                // First of all
                _.extend(this.options, options);
                if (this.model) {
                    var model = this.model;
                    this.model = new model();
                }
                this.$el = $('<' + this.tagName + '/>').addClass(this.className).attr('id', this.idName);
                this.el = this.$el[0];


                var self = this;

                // Prepare dom events
                _.each(this.domEvents, function (value, key) {
                    var split = key.split(' ');
                    var event = split[0];
                    var element = split[1] || '';
                    var method = _.bind(self[value], self);

                    var id = self.$el.attr('id');
                    var tag = self.$el.prop('tagName').toLowerCase();
                    element = (id) ? tag + '#' + id + ' ' + element : tag + element;
                    $('body').on(event, element, method);

                });

                //Special base constructor
                this.baseConstructor(this)

                // Init
                this.initialize();
            },

            tagName: 'div', // Tag name for this
            className: '', // Classes for this
            idName: 'view', // Id for this

            templatesPath: "/templates/", // Path of the templates
            templatesExtension: ".hbs", // Extension of the templates
            templateName: null, // Name current template
            template: function (moreOptions) {
                if (this.templateName) {
                    return $('<div/>').loadFromTemplate({
                        template: this.templateName,
                        path: this.templatesPath,
                        extension: this.templatesExtension,
                        data: _.extend({}, moreOptions, this.options)
                    }).html();
                }
            },

            dom: {}, // Dom elements for use in the view
            classes: {}, // Classes for use in the view

            // You can use two types of events of dom or custom
            // Examples:
            // Custom event: 'eventName': 'functionName'
            events: {},

            // Dom event:   'click #element': 'functionName'
            domEvents: {},

            // Model of this view
            model: null,

            render: function () {
                this.$el.html(this.template(this.options));
                return this;
            }
        }
    );

    // Model Class
    var Model = WinJS.Class.derive(

        Base, // Parent Class

        // Constructor
        function (options) {

            this.customConstructor(options);
        },

        // Instance Members
        {

            customConstructor: function (options) {
                // First of all
                _.extend(this.options, options);
                this.set('url', this.options.url || this.get('url') || null);

                //Special base constructor
                this.baseConstructor(this);

                // Init
                this.initialize();
            },
            // Attributes of the model
            attributes: {},

            get: function (attribute) {
                if (!attribute) {
                    return attributes;
                } else {
                    return this.attributes[attribute] || null;
                }
            },

            set: function (attribute, value) {
                this.attributes[attribute] = value;
            },

            toJSON: function () {
                return JSON.stringify(attributes);
            },

            // Array of info
            collection: [],

            // Reset collection
            resetCollection: function () {
                this.trigger('resetCollection');
                this.collection = [];
            },

            // get json from an url
            getJSON: function (data) {
                var self = this;
                var myUrl = this.get('url');

                if (myUrl) {
                    $.ajax({
                        url: myUrl,
                        async: data.async || false,
                        data: data || {}
                    }).done(function (results) {
                        var json;
                        if (typeof (results) === 'string') {
                            json = $.parseJSON(results);
                        } else {
                            json = results;
                        }

                        // Only accept array!
                        if (typeof (json) === 'object') {
                            var json_array;
                            for (json_array in json){ break; }
                            json = json[json_array];
                        }
                        _.each(json, self.addToCollection, self);

                        self.trigger('addToCollectionAll', json);
                    });
                }
            },

            // Add element to collection
            addToCollection: function (element) {
                this.trigger('addToCollection', element);
                this.collection.push(element);
            }


        }
    );

    // Router Class
    var Router = WinJS.Class.derive(

        Base, // Parent Class

        // Constructor
        function (options) {

            // First of all
            _.extend(this.options, options);

            this.$wrapper = $(this.options.wrapper) || $('body');
            this.pages = this.options.pages || {};
            WinJS.Navigation.addEventListener("navigated", _.bind(this.onNavigate, this));

            //Special base constructor
            this.baseConstructor(this);

            // Init
            this.initialize();
        },

        // Instance Members
        {

            navigate: function (page) {
                WinJS.Navigation.navigate(page);
            },

            history: function () {
                return WinJS.Navigation.history;
            },

            location: function () {
                return WinJS.Navigation.location;
            },

            back: function (distance, callback) {
                WinJS.Navigation.back(distance).done(callback);
            },

            addPage: function (page, view) {
                this.pages[page] = view;
            },

            onNavigate: function (page) {

                var pageName = page.detail.location;
                var CurrentPage = this.pages[pageName];
                var rendered = CurrentPage.render();

                this.$wrapper.html(rendered.$el);
            }
        }
    );

    // Extending WinJS
    WinJS.Class.extend = function (baseClass, constructor, instanceMembers, staticMembers) {
        if (typeof (constructor) === 'object') {
            // In this case I'm not using constructor
            return WinJS.Class.derive(baseClass, function (options) { this.customConstructor(options); }, constructor, instanceMembers);
        } else {
            // Override constructor
            return WinJS.Class.derive(baseClass, constructor, instanceMembers, staticMembers);
        }

    }


    // Namespace
    WinJS.Namespace.define("WinjsMVR", {
        View: View,
        Model: Model,
        Router: Router
    });


})(window, jQuery, _);