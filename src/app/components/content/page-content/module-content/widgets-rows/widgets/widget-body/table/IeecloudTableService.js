import IeecloudTableMapper from "./IeecloudTableMapper.js";
import IeecloudTableDao from "./IeecloudTableDao.js";

export default class IeecloudTableService {

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudTableMapper();
        this.dao = new IeecloudTableDao(dataSource);

    }

    buildColumnDefinitions(url, callBack) {
        const scope = this;
        this.dao.readScheme(url, function(result){
            const columnDefs = scope.mapper.mapColumns(result);
            callBack(columnDefs);
        });
    }

    getDataTable(url, columnDefs, callBack) {
        const scope = this;

        this.dao.readData(url, function(result){
            const rowData = scope.mapper.mapData(result, columnDefs);
            callBack(rowData);
        });
    }
}