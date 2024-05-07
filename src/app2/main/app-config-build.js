import IeecloudAppUtils from "./utils/IeecloudAppUtils.js";
import IeecloudAuthService from "./auth-core/authService.js";
import {isArray} from "lodash-es";
import {DEFAULT_APP_CODE} from "./index.js";


export let failAppLoad = false;

function initMetaEnv() {

    if (IeecloudAppUtils.isRoot(location.hash)) {
        location.assign(window.location.origin + window.location.pathname + '#/' + DEFAULT_APP_CODE);
    }

    const appName = IeecloudAppUtils.parseHashApp(location.hash);

    const service = new IeecloudAuthService(import.meta.env.APP_SERVER_ROOT_LOGIN_URL);

    const appInfo = service.syncRetrieveAppInformation(appName);

    if (isArray(appInfo)) {
        if (appInfo.length === 0) {
            failAppLoad = true;
        }

    } else {
        globalThis.import_meta_env['APP_SERVER_URL'] = globalThis.import_meta_env['APP_SERVER_URL']
            .replaceAll('{%ORG_CODE%}', appInfo['org_code'])
            .replaceAll('{%APP_TYPE%}', appInfo['type'])
            .replaceAll('{%APP_CODE%}', appInfo['code'])
            .replaceAll('{%ENV%}', globalThis.import_meta_env['ENV'].toLowerCase());

        globalThis.import_meta_env['APP_STATIC_STORAGE'] = globalThis.import_meta_env['APP_STATIC_STORAGE']
            .replaceAll('{%APP_CODE%}', appInfo['code'])
            .replaceAll('{%ENV%}', globalThis.import_meta_env['ENV'].toLowerCase());

        globalThis.import_meta_env['APP_SERVER_ROOT_URL'] = globalThis.import_meta_env['APP_SERVER_ROOT_URL']
            .replaceAll('{%APP_CODE%}', appInfo['code']);

        globalThis.import_meta_env['APP_CODE'] = globalThis.import_meta_env['APP_CODE']
            .replaceAll('{%APP_CODE%}', appInfo['code']);

        globalThis.import_meta_env['APP_TYPE'] = globalThis.import_meta_env['APP_TYPE']
            .replaceAll('{%APP_TYPE%}', appInfo['type']);

        globalThis.import_meta_env['ORG_CODE'] = globalThis.import_meta_env['ORG_CODE']
            .replaceAll('{%ORG_CODE%}', appInfo['org_code']);
    }
}

initMetaEnv();