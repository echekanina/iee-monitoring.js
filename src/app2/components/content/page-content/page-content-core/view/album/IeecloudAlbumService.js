import IeecloudAlbumMapper from "./IeecloudAlbumMapper.js";
import IeecloudAlbumDao from "./IeecloudAlbumDao.js";

export default class IeecloudAlbumService {
    #dao;
    #mapper;

    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;

    #storedUserKeyAddition;

    constructor(modelId) {
        this.#mapper = new IeecloudAlbumMapper();
        this.#dao = new IeecloudAlbumDao(this.#dataSource);
        this.#storedUserKeyAddition = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__ + '_' + modelId;
    }

    readScheme(nodeProps, callBack) {
        const scope = this;
        this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });
    }

    readCoords(dataSource, coordsFile, callBack) {
        const mode = import.meta.env.MODE;
        if (mode.includes("mock")) {
            this.#dao.readContentFile(dataSource, coordsFile, function (result) {
                callBack(result);
            });
        } else {
            this.#dao.readContentFileGET(dataSource, coordsFile, function (result) {
                callBack(result);
            });
        }

    }


    readData(nodeProps, dataSchema, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000`, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema);
            callBack(rowData);
        });
    }

}