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
        this.#dao.readScheme(`?action=schema&repoId=catalog.album`, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result);
            console.log(dataSchema)
            callBack(dataSchema);
        });
    }




    readData(nodeProps, dataSchema, callBack) {
        const scope = this;

        this.#dao.readData(`?action=data&repoId=catalog.album` + `&groupId=` + nodeProps.code + `&viewCode=default&offset=0&limit=10&sortField=cdate&sortDir=desc`, function (response) {
            const rowData = scope.#mapper.mapData(response, dataSchema, nodeProps.code);
            console.log(rowData)
            callBack(rowData);
        });
    }

}