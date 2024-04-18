globalThis.import_meta_env = {
    "APP_SERVER_URL":"https://mail.igr.spb.ru/dvm_ui_shell_conf/{%ORG_CODE%}/{%APP_TYPE%}/{%ENV%}/{%APP_CODE%}/",
    "APP_STATIC_STORAGE":"https://mail.igr.spb.ru/monitor_ui_static/{%ENV%}/{%APP_CODE%}/",
    "APP_SERVER_ROOT_URL":"https://mail.igr.spb.ru/dvmdev/api/{%APP_CODE%}",
    "APP_CODE":"{%APP_CODE%}",
    "APP_TYPE":"{%APP_TYPE%}",
    "ORG_CODE":"{%ORG_CODE%}",
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
    let pathname = '';
    if(!(window.location.hash.match(/\/(\w+)\/?$/) && window.location.hash.match(/\/(\w+)\/?$/).length >=1)) {
        location.assign(window.location.origin + window.location.pathname + '#/root');
    }

    pathname = window.location.hash.match(/\/(\w+)\/?$/)[1];

    console.log(window.location);
    console.log(pathname);
    let appInfo = globalThis.globalAppInfo[pathname];
    if(appInfo === undefined) {
        alert('Неверный url');
    } else {
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

        console.log(globalThis.import_meta_env)
    }
}

initMetaEnv();