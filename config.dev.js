globalThis.import_meta_env = {
    "APP_SERVER_URL":"https://mail.igr.spb.ru/dvm_ui_shell_conf/{%ORG_CODE%}/{%APP_TYPE%}/dev/{%APP_CODE%}/",
    "APP_STATIC_STORAGE":"https://mail.igr.spb.ru/monitor_ui_static/dev/{%APP_CODE%}/",
    "APP_SERVER_ROOT_URL":"http://localhost:8080/dvm/api/{%APP_CODE%}",
    "APP_CODE":"root",
    "APP_TYPE":"platform",
    "ORG_CODE":"iee",
    "ENV":"DEV",
    "ENV_COLOR":"#19875430",
    "ENV_TITLE_FLAG":"true"
};


globalThis.globalAppInfo = {
    "root": {"ORG_CODE":"iee", "APP_CODE":"root", "APP_TYPE":"platform"},
    "izhora": {"ORG_CODE":"georec", "APP_CODE":"izhora", "APP_TYPE":"monitoring"},
    "izhora.infra": {"ORG_CODE":"georec", "APP_CODE":"izhora.infra", "APP_TYPE":"monitoring"}
}
function initMetaEnv() {
    let pathname = window.location.hash.match(/\/(\w+)\/?$/)[1];
    console.log(window.location);
    console.log(pathname);
    let appInfo = globalThis.globalAppInfo[pathname];
    if(appInfo === undefined) {
        alert('Неверный url');
    } else {
        globalThis.import_meta_env['APP_SERVER_URL'] = globalThis.import_meta_env['APP_SERVER_URL']
            .replaceAll('{%ORG_CODE%}', appInfo['ORG_CODE'])
            .replaceAll('{%APP_TYPE%}', appInfo['APP_TYPE'])
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);

        globalThis.import_meta_env['APP_STATIC_STORAGE'] = globalThis.import_meta_env['APP_SERVER_URL']
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);

        globalThis.import_meta_env['APP_SERVER_ROOT_URL'] = globalThis.import_meta_env['APP_SERVER_ROOT_URL']
            .replaceAll('{%APP_CODE%}', appInfo['APP_CODE']);

        console.log(globalThis.import_meta_env)
    }
}

initMetaEnv();