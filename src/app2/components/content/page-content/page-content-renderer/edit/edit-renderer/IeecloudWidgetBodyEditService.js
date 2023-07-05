import IeecloudWidgetBodyEditMapper from "./IeecloudWidgetBodyEditMapper.js";
import IeecloudWidgetBodyEditDao from "./IeecloudWidgetBodyEditDao.js";

export default class IeecloudWidgetBodyEditService {

    constructor(dataSource, nodeProps) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudWidgetBodyEditMapper();
        this.dao = new IeecloudWidgetBodyEditDao(dataSource);

        this.repoId = nodeProps.repoId;
        this.filterUrlParams = this.#buildFilter(nodeProps, "filter", "filterValues");


    }

    #buildFilter(nodeProps, filterProp, filterValuesProp) {
        let filterUrlParams = '';
        let filtersString = [];
        if (nodeProps.hasOwnProperty(filterProp) && nodeProps.hasOwnProperty(filterValuesProp)
            && nodeProps[filterProp] !== "" && nodeProps[filterValuesProp] !== "") {
            filterUrlParams = '&filter=';
            const filterNames = nodeProps[filterProp].split(';');
            const filterValues = nodeProps[filterValuesProp].split(';');
            if (filterNames.length > 0 && filterValues.length > 0) {
                filterNames.forEach(function (filterProp, index) {
                    filtersString.push(filterProp + ':' + filterValues[index]);
                });
            }
        }

        return filterUrlParams.concat(filtersString.join(filterUrlParams))
    }


    buildColumnDefinitionsAndFilter(nodeProps, callBack) {
        const scope = this;
        this.dao.readScheme(`?action=schema&repoId=` + scope.repoId + `&groupId=` + nodeProps.groupId, function (tableScheme) {
            const columnDefs = scope.mapper.mapColumns(tableScheme);
            callBack(columnDefs);
        });
    }

    getEditDataTable(nodeProps, columnDefs, callBack) {
        const scope = this;

        let url = `?action=data&repoId=` + scope.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000`;

        // TODO: workaround to do not change mock
        if (scope.filterUrlParams && scope.filterUrlParams.length > 0) {
            url = url + '&sortField=time&sortDir=desc'
        }

        this.dao.readData(url + scope.filterUrlParams, function (result) {
            const rowData = scope.mapper.mapData(result, columnDefs);
            callBack(rowData);
        });
    }
}