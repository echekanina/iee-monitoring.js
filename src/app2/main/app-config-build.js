import IeecloudAppUtils from "./utils/IeecloudAppUtils.js";

export const DEFAULT_APP_CODE = "root";


// TODO: get from API LIST
const APP_INFO_MAP = {
    "root": {"ORG_CODE": "iee", "APP_CODE": "root", "APP_TYPE": "platform"},
    "izhora": {"ORG_CODE": "georec", "APP_CODE": "izhora", "APP_TYPE": "monitoring"},
    "izhora.infra": {"ORG_CODE": "georec", "APP_CODE": "izhora.infra", "APP_TYPE": "monitoring"}
}

function initMetaEnv() {

    if (IeecloudAppUtils.isRoot(location.hash)) {
        location.assign(window.location.origin + window.location.pathname + '#/' + DEFAULT_APP_CODE);
    }

    const appName = IeecloudAppUtils.parseHashApp(location.hash);

    let appInfo = APP_INFO_MAP[appName];
    if (!appInfo) {
        console.error('wrong url');
    } else {

        // const mode = import.meta.env.MODE;
        // console.log(mode)
        // if("mock" === mode){
        //     return;
        // }

        globalThis.import_meta_env['APP_SERVER_URL'] = globalThis.import_meta_env['APP_SERVER_URL']
            .replaceAll('{%ORG_CODE%}', appInfo['ORG_CODE'])
            .replaceAll('{%APP_TYPE%}', appInfo['APP_TYPE'])
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE'])
            .replaceAll('{%ENV%}', globalThis.import_meta_env['ENV'].toLowerCase());

        globalThis.import_meta_env['APP_STATIC_STORAGE'] = globalThis.import_meta_env['APP_STATIC_STORAGE']
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE'])
            .replaceAll('{%ENV%}', globalThis.import_meta_env['ENV'].toLowerCase());

        globalThis.import_meta_env['APP_SERVER_ROOT_URL'] = globalThis.import_meta_env['APP_SERVER_ROOT_URL']
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);

        globalThis.import_meta_env['APP_CODE'] = globalThis.import_meta_env['APP_CODE']
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);

        globalThis.import_meta_env['APP_TYPE'] = globalThis.import_meta_env['APP_TYPE']
            .replaceAll('{%APP_TYPE%}', appInfo['APP_TYPE']);

        globalThis.import_meta_env['ORG_CODE'] = globalThis.import_meta_env['ORG_CODE']
            .replaceAll('{%ORG_CODE%}', appInfo['ORG_CODE']);
    }
}

initMetaEnv();