import IeecloudLoginRenderer from "../login-renderer/IeecloudLoginRenderer.js";
import IeecloudLoginService from "./loginService.js";
import EventDispatcher from "../events/EventDispatcher.js";

export default class IeecloudLoginController extends EventDispatcher {
    #service;
    #loginRenderer;


    constructor() {
        super();
        this.#service = new IeecloudLoginService(import.meta.env.APP_SERVER_ROOT_LOGIN_URL)

    }

    destroyUI() {
        this.#loginRenderer?.destroy();
    }


    initUI(containerId) {
        const scope = this;
        scope.destroyUI();
        scope.#loginRenderer = new IeecloudLoginRenderer(containerId);
        scope.#loginRenderer.render();

        scope.#loginRenderer.addEventListener('IeecloudLoginRenderer.loginPressed', function (event) {
            const credential = event.value;

            scope.#service.login(credential, function (result) {
                scope.dispatchEvent({
                    type: 'IeecloudLoginController.loginSuccess', value: {accessToken: result.token}
                });
            });
        });
    }

    logout(){
        const scope = this;
        scope.dispatchEvent({
            type: 'IeecloudLoginController.logout'
        });
    }

    tryToGetUserProfileInfo(accessToken) {
        const scope = this;
        scope.#service.tryToGetUserProfileInfo(accessToken, function (result, success) {
            if (success) {
                scope.dispatchEvent({
                    type: 'IeecloudLoginController.profileReceived', value: {profile: result}
                });
            } else {
                scope.dispatchEvent({
                    type: 'IeecloudLoginController.profileRejected'
                });
            }

        });
    }

}