export default class IeecloudLoginDao {
    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    loginRequest(user, password, callback) {


        fetch(this.dataSource + '/auth/login' + "?user=" + user + "&password=" + password, {
            method: 'GET',
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