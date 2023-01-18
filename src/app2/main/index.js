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

export const eventBus = new EventEmitter2();

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const appService = new IeecloudAppService(import.meta.env.VITE_APP_SERVER_URL);

    appService.getAppScheme(import.meta.env.VITE_APP_SCHEME_FILE_NAME, function (schemeModel) {

        appService.getAppData(import.meta.env.VITE_APP_MODEL_FILE_NAME, function (treeData) {

            const systemController = new IeecloudTreeInspireImpl();
            systemController.createTree(treeData);

            const appController = new IeecloudAppController(schemeModel, systemController);
            appController.init("app");

        });
    });
});

