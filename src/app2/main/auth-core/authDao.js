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

    profileRequestWithHeaders(accessToken, callback) {
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

    profileRequest(accessToken, callback) {
        fetch(this.dataSource + '/profile/info' + "?x-iee-api-session-token=" + accessToken, {
            method: 'GET'
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
}