import fetchIntercept from 'fetch-intercept';
import {IeecloudErrorHandlerController} from "./common/error-handler/IeecloudErrorHandlerController.js";


function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    const errorHandlerController = new IeecloudErrorHandlerController();
    errorHandlerController.init("app");


    const unregister = fetchIntercept.register({


        request: function (url, config) {
            // Modify the url or config here
            return [url, config];
        },

        requestError: function (error) {
            // Called when an error occured during another 'request' interceptor call
            return Promise.reject(error);
        },

        response: function (response) {

            if (!response.ok) {
                response.text().then(text => errorHandlerController.showError(response.status, text));
            }

            return response;
        },

        responseError: function (error) {

            if (error.name !== 'AbortError') {
                errorHandlerController.showError(error.code,'');
            }
            // Handle an fetch error
            return Promise.reject(error);
        }
    });

});

