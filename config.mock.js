globalThis.import_meta_env = {
    "APP_SERVER_URL":"http://127.0.0.1:3001",
    "APP_STATIC_STORAGE":"http://notebook.ieecloud.com:8080/monitor_ui_static/dev/izhora/",
    "APP_SERVER_ROOT_URL":"http://notebook.ieecloud.com:8080/dvmdev/api/izhora",
    "APP_CODE":"izhora",
    "APP_TYPE":"monitoring",
    "ORG_CODE":"georec",
    "ENV":"mock",
    "ENV_COLOR":"#19875430",
    "ENV_TITLE_FLAG":"true"
};


globalThis.globalAppInfo = {
    "root": {"ORG_CODE":"iee", "APP_CODE":"root", "APP_TYPE":"platform"},
    "izhora": {"ORG_CODE":"georec", "APP_CODE":"izhora", "APP_TYPE":"monitoring"},
    "izhora.infra": {"ORG_CODE":"georec", "APP_CODE":"izhora.infra", "APP_TYPE":"monitoring"}
}
// function initMetaEnv() {
//     let pathname = window.location.hash.match(/\/(\w+)\/?$/)[1];
//     console.log(window.location);
//     console.log(pathname);
//     let appInfo = globalThis.globalAppInfo[pathname];
//     if(appInfo === undefined) {
//         alert('Неверный url');
//     } else {
//         globalThis.import_meta_env['APP_SERVER_URL'] = globalThis.import_meta_env['APP_SERVER_URL']
//             .replaceAll('{%ORG_CODE%}', appInfo['ORG_CODE'])
//             .replaceAll('{%APP_TYPE%}', appInfo['APP_TYPE'])
//             .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);
//
//         globalThis.import_meta_env['APP_STATIC_STORAGE'] = globalThis.import_meta_env['APP_SERVER_URL']
//             .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);
//
//         globalThis.import_meta_env['APP_SERVER_ROOT_URL'] = globalThis.import_meta_env['APP_SERVER_ROOT_URL']
//             .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);
//
//         console.log(globalThis.import_meta_env)
//     }
// }

// initMetaEnv();