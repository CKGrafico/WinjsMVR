/*
	WinJS MVR a simple library to do better and easy apps in Windows 8 with WinJS
	Inspired in Backbone but more simple and oriented to WinJS
	author: @CKGrafico
	version: beta-0.9.5
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

				// Prepare events
				this.configEvents();
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
				this.dispatchEvent(event, options || {});
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

			// Remove or capture Events
			configEvents: function(remove) {
				// Prepare custom events
				var self = this;
				_.each(this.events, function (value, key) {
					var split = key.split('/');
					var event;

					if (split.length === 2) {

						// event like:  events: {'model/MyEvent': 'Callback'}
						var object = split[0];
						event = split[1];

						if (self[value]) {
							if(remove) {
								self[object].off(event);
							}else{
								self[object].on(event, self[value], self);
							}
						} else {
							console.error(self[value]);
						}
					} else {

						// event like:  events: {'MyEvent': 'Callback'}
						event = key;

						if (self[value]) {
							if(remove) {
								self.off(event);
							}else{
								self.on(event, self[value], self);
							}
						} else {
							console.error(self[value]);
						}
					}
				});
			}

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
				this.configDomEvents();

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
				return Handlebars.getTemplate({
					templateName: this.templateName,
					templatesPath: this.templatesPath,
					templatesExtension: this.templatesExtension,
					data: _.extend({}, this.options, this.moreOptions)
				});


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
			},

			// Remove or Capture domevents
			configDomEvents: function(remove){
				var self = this;
				_.each(this.domEvents, function (value, key) {
					var split = key.split(' ');
					var eventName;
					var element = '';
					var method;

					_.each(split, function(el, i){
						switch(i) {
							case 0:
								eventName = el;
							break;
							default:
								element += ' ' + el
						}
					});

					if (self[value]) {
						method = _.bind(self[value], self);
					} else {
						console.error(self[value]);
					}

					if(remove){
						$(document).off(eventName, '#' + self.idName + element);
					}else{
					   $(document).on(eventName, '#' + self.idName + element, method);
					}

				});
			},

			// Optional is called by Navigator after render a page
			afterRender: null
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

			removePage: function(page){
				var myPage = this.pages[page];
				if(myPage){
					this.pages[page].configEvents(true);
					this.pages[page].configDomEvents(true);
					this.pages[page] = null;
					delete this.pages[page]
				}
			},

			onNavigate: function (page) {

				var pageName = page.detail.location;
				this.currentPage = this.pages[pageName];
				this.currentPage.render();
				this.$wrapper.html(this.currentPage.$el);


				if(this.currentPage.afterRender) {
					this.currentPage.afterRender();
				}

				if(this.currentPage.afterNavigate) {
					this.currentPage.afterNavigate();
				}
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

	// Template compiler for Handlebars (thanks @uriusfuris)
	(function(Handlebars){
		// handlebars
		Handlebars.getTemplate = function(options) {

			var url = options.templatesPath + options.templateName + options.templatesExtension; 
			if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
				$.ajax({
					url :  url,
					data: options.data,
					success : function(data) {
						if (Handlebars.templates === undefined) {
							Handlebars.templates = {};
						}
							
						Handlebars.templates[name] = Handlebars.compile(data);
					},
					async : false
				});
			}
			return Handlebars.templates[name];
		};

	})(Handlebars);


	// Namespace
	WinJS.Namespace.define("WinjsMVR", {
		View: View,
		Model: Model,
		Router: Router
	});


})(window, jQuery, _);