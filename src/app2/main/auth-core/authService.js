import IeecloudAuthMapper from "./authMapper.js";
import IeecloudAuthDao from "./authDao.js";
import {isArray} from "lodash-es";

export default class IeecloudAuthService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudAuthMapper();
        this.dao = new IeecloudAuthDao(dataSource);
    }

    login(credential, callBack) {
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

    syncRetrieveAppInformation(appName) {
        const result = this.dao.retrieveSyncAppInformation(appName);
        return result?.data;
    }

    retrieveAppInformation(appName, callBack) {
        this.dao.retrieveAppInformation(appName, function (result) {

            let appInfo = result.data;
            // TODO: WTF response from server???
            if (isArray(result.data)) {
                if (result.data.length === 0) {
                    appInfo = null;
                }
            }

            callBack(appInfo);
        });
    }

    tryToGetUserProfileInfo(accessToken, callBack) {
        this.dao.profileRequest(accessToken, function (result, success) {
            callBack(result, success);
        });
    }

    tryToGetUserAccessScheme(accessToken, callBack) {
        const scope = this;
        this.dao.accessScheme(import.meta.env.VITE_APP_SERVER_READ_DATA_URI + `?action=schema&repoId=rinf.role.app.module.access` + `&viewCode=with_user`, accessToken, function (result, success) {
            const dataSchema = scope.mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }
    tryToGetUserAccessData(accessToken, scheme, profile, callBack) {
        const scope = this;
        const userCode = profile.code
        this.dao.accessData(import.meta.env.VITE_APP_SERVER_READ_DATA_URI + `?action=data&repoId=rinf.role.app.module.access` + `&viewCode=with_user` +
            `&formatData=props` + `&filter=app_code:eq:${import.meta.env.APP_CODE}&filter=user_code:eq:${userCode}`, accessToken, function (result, success) {
            const accessData = scope.mapper.mapData(result, scheme);
            callBack(accessData);
        });
    }

}