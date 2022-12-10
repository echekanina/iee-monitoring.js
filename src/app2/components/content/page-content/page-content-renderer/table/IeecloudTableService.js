import IeecloudTableMapper from "./IeecloudTableMapper.js";
import IeecloudTableDao from "./IeecloudTableDao.js";

export default class IeecloudTableService {

    constructor(dataSource) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudTableMapper();
        this.dao = new IeecloudTableDao(dataSource);

    }

    buildColumnDefinitionsAndFilter(nodeProps, callBack) {
        const scope = this;
        this.dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(tableScheme){
            const columnDefs = scope.mapper.mapColumns(tableScheme, nodeProps);
            callBack(columnDefs);
        });
    }

    getDataTable(nodeProps, columnDefs, filter, callBack) {
        console.log(filter)
        const scope = this;

        let url = `?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000`;

        // TODO: workaround to do not change mock
        if(filter && filter.length > 0) {
            url = url + '&sortField=time&sortDir=desc'
        }

        this.dao.readData(url  + filter, function(result){
            const rowData = scope.mapper.mapData(result, columnDefs);
            callBack(rowData);
        });
    }
}