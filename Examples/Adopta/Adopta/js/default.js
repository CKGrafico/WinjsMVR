// Para obtener una introducción a la plantilla En blanco, consulte la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function (global) {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var applicationData = Windows.Storage.ApplicationData.current;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

                WinJS.Application.onsettings = function (e) {
                    var vector = e.detail.e.request.applicationCommands;
                    var cmd1 = new Windows.UI.ApplicationSettings.SettingsCommand("privacy", "Privacy", function () {
                        window.open('http://ckgrafico.com/privacy/');
                    });
                    vector.append(cmd1);

                    var vector = e.detail.e.request.applicationCommands;
                    var cmd2 = new Windows.UI.ApplicationSettings.SettingsCommand("animalia", "Mundo Animalia", function () {
                        window.open('http://www.mundoanimalia.com/animales_en_adopcion');
                    });
                    vector.append(cmd2);
                }

                App.start('Home');

            } else {
                // App reactivated
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // App will be suspended
        // Complete async operations.
        // args.setPromise().
    };

    app.start();
})(window);
