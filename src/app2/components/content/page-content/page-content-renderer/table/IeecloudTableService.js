import IeecloudTableMapper from "./IeecloudTableMapper.js";
import IeecloudTableDao from "./IeecloudTableDao.js";

export default class IeecloudTableService {

    constructor(dataSource, layoutType, nodeProps) {
        this.dataSource = dataSource;
        this.mapper = new IeecloudTableMapper();
        this.dao = new IeecloudTableDao(dataSource);

        switch (layoutType) {
            case "default":
                this.repoId = nodeProps.repoId;
                this.filterUrlParams = this.#buildFilter(nodeProps, "filter", "filterValues");
                break
            case "indicators":
                this.repoId = nodeProps.indicatorsRepoId;
                this.filterUrlParams = this.#buildFilter(nodeProps, "indicatorsRepoFilter", "indicatorsRepoFilterValues");
                break
            default:
                this.repoId = nodeProps.repoId;
                this.filterUrlParams = this.#buildFilter(nodeProps, "filter", "filterValues");
        }


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

    getDataTable(nodeProps, columnDefs, callBack) {
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