export default class IeecloudAppDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    readAppFile(file, callback) {

        const appCode = import.meta.env.APP_CODE;
        const appType = import.meta.env.APP_TYPE;
        const orgCode = import.meta.env.ORG_CODE;
        const env = import.meta.env.ENV;
        const data = {fileName: file, appCode: appCode, orgCode: orgCode, appType: appType, env: env};

        fetch(this.dataSource + '/read-file' + "?ms=" + Date.now(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
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


    readAppFileGet(file, callback) {

        fetch(this.dataSource + file + "?ms=" + Date.now(), {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }
}