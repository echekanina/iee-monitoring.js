import IeecloudLoginDao from "./loginDao.js";
import IeecloudLoginMapper from "./loginMapper.js";

export default class IeecloudLoginService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudLoginMapper();
        this.dao = new IeecloudLoginDao(dataSource);
    }

    login(credential, callBack) {
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
        } else {
            this.dao.loginRequest(credential.username, credential.password, function (result) {
                callBack(result);
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