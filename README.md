
WinjsMVR
=====================
### Your library to make apps for Windows8  more easy in HTML5 ###

This library is based in backbone but built with WinJS if you're expert in backbone or angular, probably you don't need this, otherwise if you're a beginner in MV* libraries, probably WinjsMVR can help you.

Question 1: ¿Is this MVR better than others?
NO

Question 2: ¿Why?
Because is specific for WinJS and inspirated in Backbone but maked with WinJS API, if you're an expert with and MV* use it and don't use this :)

----------
Documentation
---------

### View ###

**Important things**

- **this.el** DOM object that correspond to this view
- **this.$el:** jQuery object that corresponds to this.el
- **this.options:** the options of your view (corresponds to object parameter when you create a new view)
- **this.on()** on: function (event, callback, context) {} //Subscribe to custom event
- **this.off()** off: function (event, callback, context) {} //Remove custom event
- **this.once()** once: function (event, callback, context) {} //Subscribe custom event once
- **this.trigger()** trigger: function (event, options) {} //Trigger custom event once

**Overwriting options**

 - **tagName:** 'header' *//Tag name for the view* #default 'div'
 - **className:** 'myclass1 myclass2 myclass3' *//Classes for this element*  #default ''
 - **idName:** 'webheader' *//Id name for the view* #default 'view' + random

 - **templatesPath:** '/customPath/' *//Path of the templates* #default 'templates'
 - **templatesExtension:** '.html' *//Extension of the templates* #default '.hbs'
 - **templateName:** 'mytemplate' *//Name current template* #default null
 - **template:** function(); *//Compile the template with Handlebars


**Completing other options**

    dom: { // Dom elements for use in the view
        myElemet: 'span.with-class',
        otherElement: 'header'
    }

----------

    classes: { // Classes for use in the view
        myClass: 'exampleofclass',
        otherClass: 'other-class'
    }

----------

    model: App.myModel  // Model of this view (you can put the same model in different views)

----------
    events: {
    // Custom Events (you can use events of this view or of views created inside this)
    // The event is propagated to parent View
        'eventName': 'functionName', // (this.functionName(e){})
        'otherview/OtherEventName': 'otherFunction'
    }

----------
    domEvents: {
    // Easy events of dom that corresponds to this view
        'click#elementInsideView': 'functionName'
    }

----------

**Methods**


    initialize: function() {
        // The first method who is called
    },

----------

    render: function() {
        // You can call it when you want to render the view
        // Example: this.$el.html(this.template(this.options));
        return this
    },

----------
    customMethod: function() {
        // You can use also custom methods (obviously)
    },

   ----------
**Examples**

***Write a View***

    App.Views.Header = WinJS.Class.extend(WinjsMVR.View,{...});

***Create new View***

    var header = new App.Views.Header({ name: Quique }); //you can pass options object (this.options in the view)

***Example initialize***

    initialize: function () {
        this.filtersArray = [
            { id: 'perros', name: t('Perros'), selected: true},
            { id: 'gatos', name: t('Gatos'), selected: true },
            { id: 'machos', name: t('Machos'), selected: true },
            { id: 'hembras', name: t('Hembras'), selected: true }
        ];
        this.filters = new App.Views.Filters({ filters: this.filtersArray });
    }

***Example rendering***

    render: function () {
    // The view has this.el and this.$el that corresponds to this view object in the dom
        this.$el.html(this.template(this.options));
    this.$el.append(this.filters.render().$el);
        return this;
    }

### Model ###

**<i class="icon-hdd"></i>Important things**

- **this.options:** the options of your model (corresponds to object parameter when you create a new model)
- **this.on()** on: function (event, callback, context) {} *//Subscribe to custom event*
- **this.off()** off: function (event, callback, context) {} *//Remove custom event*
- **this.once()** once: function (event, callback, context) {} *//Subscribe custom event once*
- **this.trigger()** trigger: function (event, options) {} *//Trigger custom event once*
- **this.get()** get: function (attribute) {} *//get attribute from the model*
- **this.set()** set: function (attribute, value) {} *//set attribute from the model*
- **this.delete()** delete: function (attribute) {} *//delete attribute from the model*
- **this.toString()** toString: function () {} *//Convert attributes object to string*


**<i class="icon-cog"></i>Completing other options**

    attributes: { // Attributes of the model
        myAttribute: 'title',
        other: 2
    }

----------
    events: {
    // Custom Events (you can use events of this view or of views created inside this)
    // The event is propagated to parent View
        'eventName': 'functionName', // (this.functionName(e){})
        'otherview/OtherEventName': 'otherFunction'
    }


**<i class="icon-folder"></i>Methods**

    initialize: function() {
        // The first method who is called
    },

----------

    customMethod: function() {
        // You can use also custom methods (obviously)
    },

   ----------
**<i class="icon-file"></i>Examples**

***Write a Model***

    App.Models.Animal = WinJS.Class.extend(WinjsMVR.Model,{...});

***Create new Model***

    var myModel = new App.Models.Animal();

***Example attributes***

    attributes: {
        url: 'http://adopta.azurewebsites.net',
        p: 0
    },

***Example filling collection***

    this.getJSON({
        path: this.get('path') || '',
        tags:  tags,
        p: this.get('p') || 0,
        async: true
    });
    
### Controller ###

**<i class="icon-hdd"></i>Important things**

- **this.options:** the options of your collection (corresponds to object parameter when you create a new collection)
- **this.on()** on: function (event, callback, context) {} *//Subscribe to custom event*
- **this.off()** off: function (event, callback, context) {} *//Remove custom event*
- **this.once()** once: function (event, callback, context) {} *//Subscribe custom event once*
- **this.trigger()** trigger: function (event, options) {} *//Trigger custom event once*
- **this.get()** get: function (id) {} *//get model from collection*
- **this.set()** set: function (id, attribute, value) {} *//set attribute from the model of collection*
- **this.extend()** extend: function (id, options) {} *//extend model from collection*
- **this.add()** add: function (element) {} *//add element to collection*
- **this.addSome()** addSome: function (elements) {} *//add some elements to collection*
- **this.remove()** remove: function (id) {} *//remove a element from collection*
- **this.clear()** clear: function () {} *//clear collection*
- **this.load()** load: function (data) {} *//insert array of objects into collection*
- **this.toJSON()** toJSON: function () {} *//Convert collection to array of objects*
- **this.toString()** toString: function () {} *//Convert collection to array of objects and stringify*
- **this.getJSON()** getJSON: function (data, callback) {} *//Call tourl and put the JSON in collection*


### Router ###

**Important things**

- **this.$wrapper** Container of our app come from this.options.wrapper
- **this.pages:** object with the pages
- **this.options:** the options of your view (corresponds to object parameter when you create a new router)
- **this.on()** on: function (event, callback, context) {} //Subscribe to custom event
- **this.off()** off: function (event, callback, context) {} //Remove custom event
- **this.once()** once: function (event, callback, context) {} //Subscribe custom event once
- **this.trigger()** trigger: function (event, options) {} //Trigger custom event once
- **this.navigate()** navigate: function (pages) {} //Navigate with WinJS.Navigation
- **this.history()** history: function () {} //Get history of navigation
- **this.location()** location: function () {} //Get current location
- **this.back()** back: function (distance, callback) {} //Navigate to previous pages
- **this.addPage()** addPage: function (pageName, view) {} //Transform simple View to page
- **this.onNavigate()** onNavigate: function (page) {} //Is called when you navigate

**Examples**

***Example init router***

    global.App = {
        Views: {},
        Models: {},

        start: function (view) {
            this.router = new WinjsMVR.Router({ wrapper: '#wrapper' });
            this.router.addPage(view, new this.Views[view]);
            this.router.navigate(view);
        }


    };

    [More info, the code is commented][1]


  [1]: https://github.com/CKGrafico/WinjsMVR/blob/master/core/WinjsMVR.js