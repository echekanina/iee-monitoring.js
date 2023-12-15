export default class IeecloudContentDao {
    #appServerUrl; // dvm-ui-shell-configs.js jsons (local or not)
    #appServerFullRootUrl; //API
    constructor(appServerUrl, appServerFullRootUrl) {
        this.#appServerUrl = appServerUrl;
        this.#appServerFullRootUrl = appServerFullRootUrl;

    }

    readContentFile(file, callback) {
        const appCode = import.meta.env.APP_CODE;
        const appType = import.meta.env.APP_TYPE;
        const orgCode = import.meta.env.ORG_CODE;
        const env = import.meta.env.ENV;
        const data = {fileName: file, appCode: appCode, orgCode: orgCode, appType: appType, env: env};

        fetch(this.#appServerUrl + '/read-file'  + "?ms=" + Date.now(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readContentFileGET(file, callback) {

        fetch(this.#appServerUrl + file + "?ms=" + Date.now(), {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readData(url, callback) {
        fetch(this.#appServerFullRootUrl + url, {
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }
}