import IeecloudAuthMapper from "./authMapper.js";
import IeecloudAuthDao from "./authDao.js";

export default class IeecloudAuthService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudAuthMapper();
        this.dao = new IeecloudAuthDao(dataSource);
    }

    login(credential, callBack) {
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
        } else {
            let loginObject = {
                'user': credential.username,
                'password': credential.password
            };

            let formBody = [];
            for (let property in loginObject) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(loginObject[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            this.dao.loginRequest(formBody, function (result, success) {
                callBack(result, success);
            });
        }
    }

    tryToGetUserProfileInfo(accessToken, callBack) {
        const scope = this;
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
        } else {
            this.dao.profileRequest(accessToken, function (result, success) {
                callBack(result, success);
            });
        }
    }

}