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
import "./app-config-build.js";
import "./fetch-interceptor.js";
import IeecloudTreeController from "../components/tree/tree-core/IeecloudTreeController.js";
import IeecloudOptionsController from "../components/options/options-core/IeecloudOptionsController.js";
import IeecloudAppUtils from "./utils/IeecloudAppUtils.js";

export const eventBus = new EventEmitter2();

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    window.addEventListener('hashchange', function () {

        const params = IeecloudAppUtils.parseHashParams(location.hash);

        const nodeId = params['id'];
        if (nodeId) {
            eventBus.emit('index.paramsValue', nodeId, false);
            return;
        }

        const appNameFromHash = IeecloudAppUtils.parseHashApp(location.hash);

        if (appNameFromHash !== import.meta.env.APP_CODE || IeecloudAppUtils.isOnlyProjectInHash(location.hash)) {
            document.location.reload();
        }
    });

    console.info(import.meta.env.APP_SERVER_URL)
    console.info(import.meta.env.APP_STATIC_STORAGE)
    console.info(import.meta.env.APP_SERVER_ROOT_URL)
    console.info(import.meta.env.ENV)
    console.info(import.meta.env.APP_CODE)
    console.info(import.meta.env.ORG_CODE)
    console.info(import.meta.env.APP_TYPE)


    const appService = new IeecloudAppService(import.meta.env.APP_SERVER_URL);

    appService.getConfigFileContent(import.meta.env.VITE_TREE_APP_SETTINGS_FILE_NAME, function (treeAppSettings) {
        appService.getAppScheme(import.meta.env.VITE_APP_SCHEME_FILE_NAME, function (schemeModel) {

            appService.getAppData(import.meta.env.VITE_APP_MODEL_FILE_NAME, function (treeData) {

                const systemController = new IeecloudTreeInspireImpl();
                systemController.createTree(treeData);

                const contentOptionsController = new IeecloudOptionsController(treeAppSettings, null, null,  schemeModel, systemController);

                new IeecloudTreeController(systemController, schemeModel, contentOptionsController.treeSettings);

                const appController = new IeecloudAppController(schemeModel, systemController, contentOptionsController.treeSettings);
                appController.init("app");

            });
        });
    });
});

