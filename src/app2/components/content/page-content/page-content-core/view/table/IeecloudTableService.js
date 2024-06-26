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
            case "incidents":
                this.repoId = nodeProps.incidents_repo_code
                this.viewCode = nodeProps.incidents_repo_view_code;
                this.filterUrlParams = this.#buildFilter(nodeProps, "incidents_repo_filter", "incidents_repo_filter_values");
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
            const result = scope.mapper.mapColumns(tableScheme);
            callBack(result);
        });
    }

    getDataTable(activeNode, columnDefs, params, callBack) {
        const scope = this;

        const offset = params.startRow;
        const limit = params.endRow;

        const sortField = params.sortModel ? params.sortModel[0]?.colId : params.sortField;
        const sortDir = params.sortModel ? params.sortModel[0]?.sort : params.sortDir;


        const nodeProps = activeNode.properties;

        let url = `?action=data&repoId=` + scope.repoId + `&groupId=` + nodeProps.groupId +
            (scope.viewCode ? `&viewCode=` + scope.viewCode : "") +  `&offset=` + offset +  `&limit=` + limit +
            (sortField ? `&sortField=` + sortField : '') + (sortDir ? `&sortDir=` + sortDir : '')

        this.dao.readData(url + (scope.filterUrlParams ? scope.filterUrlParams : ""), function (result) {
            const rowData = scope.mapper.mapData(result, columnDefs);
            const pageData = {totalRecords : result.total, rowData: rowData}
            callBack(pageData);
        });
    }

    abortRequest(){
        this.dao.abortRequest();
    }
}