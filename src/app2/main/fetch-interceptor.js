import fetchIntercept from 'fetch-intercept';
import {IeecloudErrorHandlerController} from "./common/error-handler/IeecloudErrorHandlerController.js";
import isNetworkError from 'is-network-error';
import IeecloudAppService from "./main-core/mainService.js";

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const appService = new IeecloudAppService(import.meta.env.APP_SERVER_URL);
    appService.getConfigFileContent(import.meta.env.VITE_THEME_APP_SETTINGS_FILE_NAME, function (appThemeSettings) {

        window.errorHandlerController = new IeecloudErrorHandlerController(appThemeSettings);
        window.errorHandlerController.init("app");
        const unregister = fetchIntercept.register({


            request: function (url, config) {
                const accessToken = localStorage.getItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__);
                if (accessToken && accessToken.trim().length > 0) {
                    // url = IeecloudAppUtils.addQueryParamsToUrl(url, {'x-iee-api-session-token': accessToken});

                    if (!config.headers) {
                        config.headers = {};
                    }
                    if(url?.startsWith(import.meta.env.APP_SERVER_ROOT_URL)){
                        config.headers['x-iee-api-session-token'] = accessToken;
                    }
                }
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
                    const msg = error.stack ? error.stack : error;
                    errorHandlerController.showError(error.code, msg, isNetworkError(error));
                }
                // Handle an fetch error
                return Promise.reject(error);
            }
        });

    });

});

