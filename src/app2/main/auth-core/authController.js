import IeecloudLoginRenderer from "../auth-renderer/IeecloudLoginRenderer.js";
import IeecloudAuthService from "./authService.js";
import EventDispatcher from "../events/EventDispatcher.js";
import IeecloudAppUtils from "../utils/IeecloudAppUtils.js";

export default class IeecloudAuthController extends EventDispatcher {
    #service;
    #loginRenderer;


    constructor() {
        super();
        this.#service = new IeecloudAuthService(import.meta.env.APP_SERVER_ROOT_LOGIN_URL)

    }

    destroyUI() {
        this.#loginRenderer?.destroy();
    }


    initUI(containerId) {
        const scope = this;
        scope.destroyUI();

        const appNameFromHash = IeecloudAppUtils.parseHashApp(location.hash);

        scope.#service.retrieveAppInformation(appNameFromHash, function (appInfo) {
            scope.#loginRenderer = new IeecloudLoginRenderer(containerId);
            scope.#loginRenderer.render(appInfo);

            scope.#loginRenderer.addEventListener('IeecloudLoginRenderer.loginPressed', function (event) {
                const credential = event.value;

                scope.#service.login(credential, function (result, success) {
                    if (success) {
                        scope.dispatchEvent({
                            type: 'IeecloudAuthController.loginSuccess', value: {accessToken: result.token}
                        });
                    } else {
                        if (result.errorCode === 'INVALID_USER_OR_PASSWORD') {
                            scope.#loginRenderer.showValidation(result.errorMsg);
                        }

                    }
                });
            });
        });
    }

    logout() {
        const scope = this;
        scope.dispatchEvent({
            type: 'IeecloudAuthController.logout'
        });
    }

    tryToGetUserProfileInfo(accessToken) {
        const scope = this;
        scope.#service.tryToGetUserProfileInfo(accessToken, function (result, success) {
            if (success) {
                scope.dispatchEvent({
                    type: 'IeecloudAuthController.profileReceived', value: {profile: result}
                });
            } else {
                scope.dispatchEvent({
                    type: 'IeecloudAuthController.profileRejected'
                });
            }

        });
    }

    tryToGetUserAccessInfo(accessToken, profile) {
        const scope = this;
        scope.#service.tryToGetUserAccessScheme(accessToken, function (resultScheme) {
            scope.#service.tryToGetUserAccessData(accessToken, resultScheme, profile, function (result) {
                scope.dispatchEvent({
                    type: 'IeecloudAuthController.accessReceived', value: {profile: profile, accessInfo: result}
                });
            });


        });
    }

}