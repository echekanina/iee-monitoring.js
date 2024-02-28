import IeecloudTableMapper from "./IeecloudTableMapper.js";
import IeecloudTableDao from "./IeecloudTableDao.js";

export default class IeecloudTableService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    constructor(layoutType, nodeProps) {
        this.mapper = new IeecloudTableMapper();
        this.dao = new IeecloudTableDao(this.#dataSource);

        switch (layoutType) {
            case "default":
                this.repoId = nodeProps.repoId;
                this.viewCode = nodeProps.viewCode;
                this.filterUrlParams = this.#buildFilter(nodeProps, "filter", "filterValues");
                break
            case "indicators":
                this.repoId = nodeProps.indicatorsRepoId;
                this.viewCode = nodeProps.viewCode;
                this.filterUrlParams = this.#buildFilter(nodeProps, "indicatorsRepoFilter", "indicatorsRepoFilterValues");
                break;
            case "repos":
                this.repoId = nodeProps.repoDataId;
                this.viewCode = nodeProps.repoDataViewCode;
                break
            default:
                this.repoId = nodeProps.repoId;
                this.viewCode = nodeProps.viewCode;
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
        this.dao.readScheme(`?action=schema&repoId=` + scope.repoId + `&groupId=` + nodeProps.groupId + (scope.viewCode ? `&viewCode=` + scope.viewCode : ""), function (tableScheme) {
            const columnDefs = scope.mapper.mapColumns(tableScheme);
            callBack(columnDefs);
        });
    }

    getDataTable(activeNode, columnDefs, callBack) {
        const scope = this;

        const nodeProps = activeNode.properties;

        let url = `?action=data&repoId=` + scope.repoId + `&groupId=` + nodeProps.groupId + (scope.viewCode ? `&viewCode=` + scope.viewCode : "") + `&limit=100000`;

        // TODO: workaround to do not change mock
        if (scope.filterUrlParams && scope.filterUrlParams.length > 0) {
            url = url + '&sortField=time&sortDir=desc'
        }

        this.dao.readData(url + (scope.filterUrlParams ? scope.filterUrlParams : ""), function (result) {
            const rowData = scope.mapper.mapData(result, columnDefs);
            callBack(rowData);
        });
    }

    abortRequest(){
        this.dao.abortRequest();
    }
}