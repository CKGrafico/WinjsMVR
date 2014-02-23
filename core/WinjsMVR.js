/*
	WinJS MVR a simple library to do better and easy apps in Windows 8 with WinJS
	Inspired in Backbone but more simple and oriented to WinJS
	author: @CKGrafico
	version: 1.0.2
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
				this.dispatchEvent(event, options || {});
			},

			// Subscribe to event
			on: function (event, callback, context) {
				this.addEventListener(event, _.bind(callback, context || this));
				// detail : {};
			},

			// Remove event
			off: function (event, callback, context) {
				this.removeEventListener(event, _.bind(callback, context || this));
			},

			// Subscribe to event once
			once: function (event, callback, context) {
				var self = this;
				this.on(event, function () {
					_.bind(callback, context || self);
					self.off();
				});
			},

			// Destroy
			destroy: function() {
				// remove events
				if(this.events) {
					this.configEvents(false);
				}

				// remove dom events
				if(this.domEvents) {
					this.configDomEvents(false);
				}

				// remove all
				_.each(this, function(el){
					el = null;
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
				// random id

				if(!this.idName) {
					this.idName = 'view-' + Math.random().toString(36).substr(2,6);
				}

				// Extend options
				_.extend(this.options, options);

				// Create model
				if (this.model) {
					var Modeltemp = this.model;
					this.model = new Modeltemp();
				}

				// Create collection
				if (this.collection) {
					var CollectionTemp = this.collection;
					this.collection = new CollectionTemp();
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
			idName: null, // Id for this

			templatesPath: "/templates/", // Path of the templates
			templatesExtension: ".hbs", // Extension of the templates
			templateName: null, // Name current template

			template: function (moreOptions) { // Get the template and compile it
				var template = Handlebars.getTemplate({
					templateName: this.templateName,
					templatesPath: this.templatesPath,
					templatesExtension: this.templatesExtension
				});

				return template(_.extend({}, this.options, moreOptions));

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
				// Create attributes
				this.attributes = {};

				// First of all
				_.extend(this.attributes, options);

				//Special base constructor
				this.baseConstructor(this);

				// Init
				this.initialize();
			},


			// Attributes of the model
			attributes: null,

			// Getter attributes
			get: function (attribute) {
				if (!attribute) {
					return this.attributes;
				} else {
					return this.attributes[attribute];
				}
			},

			// Setter attributes
			set: function (attribute, value) {
				this.attributes[attribute] = value;
			},

			// Delete an atrribute
			delete: function(attribute) {
				delete this[attribute];
			},

			// Atributes to String
			toString: function () {
				return JSON.stringify(this.attributes);
			}

		}
	);

	// Collection Class
	var Collection = WinJS.Class.derive(

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

				//Special base constructor
				this.baseConstructor(this);

				// Init
				this.initialize();
			},


			// Array of info
			collection: null,

			// Model
			model: Model,

			// Last id
			lastId: -1,

			// Get element
			get: function (id) {
				return _.find(this.collection, function(el){
					return el.get('id') == id;
				});
			},

			// Edit element attribute
			set: function (id, attribute, value) {
				var model = this.get(id);
				model.attributes[attribute] = value;
				this.trigger('set', model);
			},

			// Extend element
			extend: function(id, options) {
				var model = this.get(id);
				_.extend(model, options);
				this.trigger('extend', model);
			},


			// Add element to collection
			add: function (element) {
				if(element.id){
					this.lastId = element.id;
				}else{
					this.lastId++;
				}
				var model = new this.model(_.extend(element, { id: this.lastId }));
				this.collection.push(model);
				this.trigger('add', model);
			},

			// Add array of elements to collection
			addSome: function(elements) {
				_.each(elements, this.add, this);
				this.trigger('addSome');
			},

			// Remove element from collection
			remove: function(id) {
				var model = this.get(id);
				this.collection = _.without(this.collection, model);
				this.trigger('remove', model);
			},

			// Clear collection
			clear: function() {
				this.collection = [];
				this.trigger('clear');
			},

			// Load collection with json info
			load: function(data) {
				var collection;
				if(typeof data === 'string'){
					collection = JSON.parse(data);
				}else{
					collection = data;
				}
				var self = this;
				this.addSome(collection);
				this.trigger('load', this.collection);
			},

			// Collection to String
			toString: function () {
				return JSON.stringify(_.pluck(this.collection, 'attributes'));
			},

			// Return the collection array
			toJSON: function() {
				return _.pluck(this.collection, 'attributes');
			},

			// Get JSON from an url and save it in collection
			getJSON: function (options, callback) {
				var self = this;

				if (myUrl) {
					$.ajax({
						url: options.url,
						async: options.async || true,
						data: options.data || {}
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
						self.addSome(json);
						if (callback) {
							callback(results);
						}
					});
				}
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
			if (Handlebars.templates === undefined || Handlebars.templates[options.name] === undefined) {
				$.ajax({
					url :  url,
					success : function(data) {
						if (Handlebars.templates === undefined) {
							Handlebars.templates = {};
						}

						Handlebars.templates[options.name] = Handlebars.compile(data);
					},
					async : false
				});
			}
			return Handlebars.templates[options.name];
		};

	})(Handlebars);


	// Namespace
	WinJS.Namespace.define("WinjsMVR", {
		View: View,
		Model: Model,
		Collection: Collection,
		Router: Router
	});


})(window, jQuery, _);