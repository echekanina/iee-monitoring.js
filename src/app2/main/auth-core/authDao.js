export default class IeecloudAuthDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    loginRequest(formBody, callback) {

        fetch(this.dataSource + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                if (result.status === 'ok') {
                    callback(result, true);
                } else if (result.status === 'error') {
                    callback(result, false);
                }
            });
    }

    profileRequest(accessToken, callback) {
        fetch(this.dataSource + '/profile/info', {
            method: 'GET',
            headers: {
                'x-iee-api-session-token': accessToken
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result, true);
            })
            .catch(err => {
                callback(null, false)
            });
    }


    retrieveSyncAppInformation(appName) {
        const request = new XMLHttpRequest();
        request.open("GET", this.dataSource + `/data/getOne?repoCode=ctlg.apps&formatData=props&filter=code:eq:${appName}`, false); // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        }
        return null;

    }

    retrieveAppInformation(appName, callback) {
        fetch(this.dataSource + `/data/getOne?repoCode=ctlg.apps&formatData=props&filter=code:eq:${appName}`, {
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    accessScheme(url, accessToken, callback) {
        fetch(this.dataSource + url, {
            method: 'GET',
            headers: {
                'x-iee-api-session-token': accessToken
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    accessData(url, accessToken, callback) {
        fetch(this.dataSource + url, {
            method: 'GET',
            headers: {
                'x-iee-api-session-token': accessToken
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }
}