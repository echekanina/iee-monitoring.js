import IeecloudTableMapper from "./IeecloudTableMapper.js";
import IeecloudTableDao from "./IeecloudTableDao.js";

export default class IeecloudTableService {

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudTableMapper();
        this.dao = new IeecloudTableDao(dataSource);

    }

    buildColumnDefinitions(nodeProps, callBack) {
        const scope = this;
        this.dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(result){
            const columnDefs = scope.mapper.mapColumns(result);
            callBack(columnDefs);
        });
    }

    getDataTable(nodeProps, columnDefs, callBack) {
        const scope = this;

        this.dao.readData(`?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100`, function(result){
            const rowData = scope.mapper.mapData(result, columnDefs);
            callBack(rowData);
        });
    }
}