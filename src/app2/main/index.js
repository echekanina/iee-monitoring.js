import "@fontsource/montserrat"
import "@fontsource/montserrat/cyrillic-500.css"
import "@fontsource/montserrat/cyrillic-600.css"
import "@fontsource/montserrat/cyrillic-700.css"
import "@fontsource/montserrat/cyrillic-800.css"
// TODO: sass warning  bootstrap bug https://reviews.mahara.org/c/mahara/+/13431
import '@fortawesome/fontawesome-free/css/all.min.css'
import './../../styles/scss/sb-admin-2.scss'
import 'bootstrap/dist/js/bootstrap.esm.min.js'
import IeecloudAppService from "./main-core/mainService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import EventEmitter2 from "eventemitter2";
import IeecloudAppController from "./main-core/mainController.js";
// Do not remove this import
import Dropdown from "bootstrap/js/src/dropdown.js";
import IeecloudTreeController from "../components/tree/tree-core/IeecloudTreeController.js";
import IeecloudOptionsController from "../components/options/options-core/IeecloudOptionsController.js";
import IeecloudAppUtils from "./utils/IeecloudAppUtils.js";
import IeecloudAuthController from "./auth-core/authController.js";
import {IeecloudErrorHandlerController} from "./common/error-handler/IeecloudErrorHandlerController.js";
import IeecloudAuthService from "./auth-core/authService.js";
import IeecloudAccessControl from "./utils/IeecloudAccessControl.js";

export const eventBus = new EventEmitter2();
export const accessControl = new IeecloudAccessControl();
export const DEFAULT_APP_CODE = "root";
const appDivId = "app"

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    import ("./app-config-build.js").then((module) => {
        if (!module.failAppLoad) {
            import ( "./fetch-interceptor.js").then((module) => {
                function initApplication(profile, authController) {
                    const appService = new IeecloudAppService(import.meta.env.APP_SERVER_URL);
                    appService.getConfigFileContent(import.meta.env.VITE_TREE_APP_SETTINGS_FILE_NAME, function (treeAppSettings) {
                        appService.getAppScheme(import.meta.env.VITE_APP_SCHEME_FILE_NAME, function (schemeModel) {

                            appService.getAppData(import.meta.env.VITE_APP_MODEL_FILE_NAME, function (treeData) {

                                const systemController = new IeecloudTreeInspireImpl();
                                systemController.createTree(treeData);

                                const contentOptionsController = new IeecloudOptionsController(treeAppSettings, null, null, schemeModel, systemController);

                                new IeecloudTreeController(systemController, schemeModel, contentOptionsController.treeSettings);

                                const appController = new IeecloudAppController(schemeModel, systemController,
                                    contentOptionsController.treeSettings, profile, authController);
                                appController.init(appDivId);

                            });
                        });
                    });
                }


                console.info(import.meta.env.APP_SERVER_URL)
                console.info(import.meta.env.APP_STATIC_STORAGE)
                console.info(import.meta.env.APP_SERVER_ROOT_URL)
                console.info(import.meta.env.ENV)
                console.info(import.meta.env.APP_CODE)
                console.info(import.meta.env.ORG_CODE)
                console.info(import.meta.env.APP_TYPE)

                const authController = new IeecloudAuthController();


                authController.addEventListener('IeecloudAuthController.loginSuccess', function (event) {
                    const accessTokenString = event.value?.accessToken;
                    localStorage.setItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__, accessTokenString);
                    authController.tryToGetUserProfileInfo(accessTokenString);
                });

                authController.addEventListener('IeecloudAuthController.profileReceived', function (event) {
                    const profile = event.value?.profile;
                    const accessToken = localStorage.getItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__);
                    authController.tryToGetUserAccessInfo(accessToken, profile)
                });

                authController.addEventListener('IeecloudAuthController.accessReceived', function (event) {
                    const profile = event.value?.profile;
                    const access = event.value?.accessInfo;
                    accessControl.setUserAccess(access);
                    authController.destroyUI();
                    initApplication(profile, authController, access);
                });

                authController.addEventListener('IeecloudAuthController.profileRejected', function (event) {
                    authController.initUI(appDivId);
                });

                authController.addEventListener('IeecloudAuthController.logout', function (event) {
                    localStorage.removeItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__);
                    document.location.reload();
                });


                const accessTokenString = localStorage.getItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__);
                if (accessTokenString && accessTokenString.trim().length > 0) {
                    authController.tryToGetUserProfileInfo(accessTokenString);
                } else {
                    authController.initUI(appDivId);
                }
            });

        } else {

            const service = new IeecloudAuthService(import.meta.env.APP_SERVER_ROOT_LOGIN_URL);

            const appInfo = service.syncRetrieveAppInformation(DEFAULT_APP_CODE);

            globalThis.import_meta_env['APP_SERVER_URL'] = globalThis.import_meta_env['APP_SERVER_URL']
                .replaceAll('{%ORG_CODE%}', appInfo['org_code'])
                .replaceAll('{%APP_TYPE%}', appInfo['type'])
                .replaceAll('{%APP_CODE%}', appInfo['code'])
                .replaceAll('{%ENV%}', globalThis.import_meta_env['ENV'].toLowerCase());

            const appService = new IeecloudAppService(import.meta.env.APP_SERVER_URL);
            appService.getConfigFileContent(import.meta.env.VITE_THEME_APP_SETTINGS_FILE_NAME, function (appThemeSettings) {
                const appName = IeecloudAppUtils.parseHashApp(location.hash);
                const errorHandlerController = new IeecloudErrorHandlerController(appThemeSettings);
                errorHandlerController.init("app");
                errorHandlerController.showError(404, `Неверное наименование приложения в адресной строке. ${appName} приложение не существует `, false);
            })


        }

        window.addEventListener('hashchange', function () {


            const appNameFromHash = IeecloudAppUtils.parseHashApp(location.hash);

            if (appNameFromHash !== import.meta.env.APP_CODE || IeecloudAppUtils.isOnlyProjectInHash(location.hash)) {
                document.location.reload();
                return;
            }


            const params = IeecloudAppUtils.parseHashParams(location.hash);

            const nodeId = params['id'];
            if (nodeId) {
                eventBus.emit('index.paramsValue', nodeId, false);
            }
        });

        window.addEventListener("storage", () => {
            const accessTokenString = localStorage.getItem('access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__);
            if (!accessTokenString) {
                document.location.reload();
            }
        });
    })
        .catch((err) => {
            console.log(err)
        });


});

