/*
    WinJS MVR a simple library to do better and easy apps in Windows 8 with WinJS
    Inspired in Backbone but more simple and oriented to WinJS
    author: @CKGrafico
    version: beta-0.9.2
*/


(function (global, $, _) {

    'use strict';

    var networkInfo = Windows.Networking.Connectivity.NetworkInformation;
    var networkConnectivityInfo = Windows.Networking.Connectivity.NetworkConnectivityLevel;

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
                    var split = key.split('/');
                    var event;

                    if (split.length === 2) {

                        // event like:  events: {'model/MyEvent': 'Callback'}
                        var object = split[0];
                        event = split[1];

                        if (self[value]) {
                            self[object].on(event, self[value], self);
                        } else {
                            console.error(self[value]);
                        }
                    } else {

                        // event like:  events: {'MyEvent': 'Callback'}
                        event = key;

                        if (self[value]) {
                            self.on(event, self[value], self);
                        } else {
                            console.error(self[value]);
                        }
                    }
                });
            },

            // Object with options of the class
            options: {},

            // Object with events of the class
            // Example: 'myevent': 'mycallback' (mycallback = this.mycallback)
            events: {},

            // Init function
            initialize: function () { },

            // Trigger an event
            trigger: function (event, options) {
                //var data = { type: event };
                //_.extend(data, { detail: options });
                //WinJS.Application.queueEvent(data);
                this.dispatchEvent(event, options);
            },

            // Subscribe to event
            on: function (event, callback, context) {
                this.addEventListener(event, _.bind(callback, context || this));
                //WinJS.Application.addEventListener(event, _.bind(callback, context || this)); // TO DO no only global events?
            },

            // Remove event
            off: function (event, callback, context) {
                //this.removeEventListener(event, _.bind(callback, context || this));
                WinJS.Application.removeEventListener(event, _.bind(callback, context || this));
            },

            // Subscribe to event once
            once: function (event, callback, context) {
                var self = this;
                this.on(event, function () {
                    _.bind(callback, context || self);
                    self.off();
                });
            },

        }
    );

    // Mixins
    WinJS.Class.mix(Base, WinJS.Utilities.eventMixin);

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
                // Extend options
                _.extend(this.options, options);

                // Create model
                if (this.model) {
                    var Model = this.model;
                    this.model = new Model();
                    // Pasing model events to the view
                    //this._listeners = _.extend(this._listeners || {} , this.model._listeners);
                }

                // Create $el
                this.$el = $('<' + this.tagName + '/>').addClass(this.className).attr('id', this.idName);
                this.el = this.$el[0];

                // Prepare dom events
                var self = this;
                _.each(this.domEvents, function (value, key) {
                    var split = key.split(' ');
                    var event = split[0];
                    var element = split[1] || '';
                    var method;

                    if (self[value]) {
                        method = _.bind(self[value], self);
                    } else {
                        console.error(self[value]);
                    }

                    self.$el.on(event, element, method);

                });

                // Init
                this.initialize();

                //Special base constructor
                this.baseConstructor(this);

            },

            tagName: 'div', // Tag name for this
            className: '', // Classes for this
            idName: 'view' + Math.random().toString(36).substr(2,6), // Id for this

            templatesPath: "/templates/", // Path of the templates
            templatesExtension: ".hbs", // Extension of the templates
            templateName: null, // Name current template

            template: function (moreOptions) { // Get the template and compile it
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

            // Render this view
            render: function () {
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
                // Create collection
                this.collection = [];

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

            // Getter attributes
            get: function (attribute) {
                if (!attribute) {
                    return this.attributes;
                } else {
                    return this.attributes[attribute] || null;
                }
            },

            // Setter attributes
            set: function (attribute, value) {
                this.attributes[attribute] = value;
            },

            // Atributes to String
            toString: function () {
                return JSON.stringify(this.attributes);
            },

            // Array of info
            collection: null,

            // Get JSON from an url andsave it in collection
            getJSON: function (data, callback) {
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
                        self.trigger('collection.Fill', json);
                        if (callback) {
                            callback(results);
                        }
                    });
                }
            },

            // Add element to collection
            addToCollection: function (element) {
                var newId = this.collection.length;
                element = _.extend(element, { _id: newId });
                this.collection.push(element);
                this.trigger('collection.Add', element);
            },

            //Reset the collection
            resetCollection: function() {
                this.collection = [];
                this.trigger('collection.Reset');
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

    };

    //Tools Class
    var Tools = WinJS.Class.define(

        // Constructor
        function () {
            var $progress = $('<progress/>').css({ 'position': 'absolute', 'width': '160px', 'height': '160px', 'padding': '40px', 'background': 'rgba(0, 0, 0, 0.8)', 'color': '#FFF', 'margin': '-100px -100px 0 0', 'top': '50%', 'left': '50%', 'z-index': '1000', 'border-radius': '6px' }).addClass('win-ring win-large');
            this.$loading = $('<div/>').css({ 'position': 'absolute', 'top': '0', 'left': '0', 'display': 'none', 'height': '100%', 'width': '100%' }).html($progress);
            $('body').append(this.$loading);
        },

        // Instance Members
        {
            // Funcion para crear alerts
            alert: function (options) {
                // Opciones por defecto
                var opciones = {
                    text: null,
                    btn1: "Accept",
                    btn2: null,
                    callback1: null,
                    callback2: null,
                    time: 100
                };

                // Sobrescribo opciones
                _.extend(opciones, options);
                var ShowingMessage;
                if (!ShowingMessage) {
                    ShowingMessage = true;
                    // Enseño la barra de carga
                    this.toggleLoading('fade');

                    setTimeout(function () {
                        // Create the message dialog and set its content
                        var msg = new Windows.UI.Popups.MessageDialog(opciones.text);
                        // Add commands and set their command handlers
                        msg.commands.append(
                            new Windows.UI.Popups.UICommand(opciones.btn1, opciones.callback1)
                        );
                        if (opciones.btn2) {
                            msg.commands.append(
                                new Windows.UI.Popups.UICommand(opciones.btn2, opciones.callback2)
                            );
                        }

                        // Show the message dialog
                        this.toggleLoading('fade');

                        msg.showAsync().done(function () {
                            ShowingMessage = false;
                        });
                    }, opciones.time);
                }
            },

            // Funcion que comprueba si un usuario tiene conexión
            haveInternet: function () {
                var connectionProfile = networkInfo.getInternetConnectionProfile();
                if (connectionProfile === null) {
                    return false;
                }

                var networkConnectivityLevel = connectionProfile.getNetworkConnectivityLevel();
                if (networkConnectivityLevel === networkConnectivityInfo.none
                    || networkConnectivityLevel === networkConnectivityInfo.localAccess
                    || networkConnectivityLevel === networkConnectivityInfo.constrainedInternetAccess) {
                    return false;
                }

                return true;
            },

            // Funcion que muestra un alert hasta que tengas internet
            internetMessage: function () {
                if ($("#nointernet").length === 0) {
                    $("body").prepend("<div id='nointernet' style='position: absolute;width: 100%;height: 100%;background: rgba(255,255,255,0.6);z-index: 100000;font-weight: bold;text-align: center;color: rgba(0,0,0,0.4);font-size: 6em;'>No Internet</div>");
                }

                if (this.haveInternet()) {
                    $("#nointernet").remove();
                }
            },
            //Funcion que espera a tener internet para realizar una accion
            needInternetAction: function (options) {
                // Opciones por defecto
                var opciones = {
                    callback: null,
                    param: null
                };

                // Sobrescribo opciones
                _.extend(opciones, options);
                if (this.haveInternet()) {
                    if (opciones.callback) {
                        if (opciones.param) {
                            opciones.callback(opciones.param);
                        } else {
                            opciones.callback();
                        }
                    }
                } else {
                    this.internetMessage();
                    var self = this;
                    setTimeout(function () { self.needInternetAction(opciones); }, 100);
                }
            },

            toggleLoading: function (extra) {
                if (extra) {
                    this.$loading.fadeToggle();
                }else{
                    this.$loading.toggle();
                }

            }
        }
    );

    // Namespace
    var tools = new Tools();
    WinJS.Namespace.define("WinjsMVR", {
        View: View,
        Model: Model,
        Router: Router,
        Tools: tools
    });


})(window, jQuery, _);