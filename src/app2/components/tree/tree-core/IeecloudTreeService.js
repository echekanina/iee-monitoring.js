import IeecloudTreeMapper from "./IeecloudTreeMapper.js";
import IeecloudTreeDao from "./IeecloudTreeDao.js";

export default class IeecloudTreeService {
    #dataSource = import.meta.env.APP_SERVER_ROOT_URL + import.meta.env.VITE_APP_SERVER_READ_DATA_URI;
    #mapper;
    #dao;

    constructor() {
        this.#mapper = new IeecloudTreeMapper();
        this.#dao = new IeecloudTreeDao(this.#dataSource);
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


    // readScheme(nodeProps, callBack) {
    //     const scope = this;
    //    this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function(result){
    //         const dataSchema = scope.#mapper.mapColumns(result);
    //         callBack(dataSchema);
    //     });
    //
    // }


    readScheme(nodeProps, callBack) {
        const scope = this;
        return this.#dao.readScheme(`?action=schema&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId, function (result) {
            const dataSchema = scope.#mapper.mapColumns(result);
            callBack(dataSchema);
        });

    }

    mapColumns(result){
        const scope = this;
        return scope.#mapper.mapColumns(result);
    }

    mapData(result, nodeScheme) {
        const scope = this;
        return scope.#mapper.mapData(result, nodeScheme);
    }

    readData(nodeProps) {
        this.filterUrlParams = this.#buildFilter(nodeProps, "filter", "filterValues");
        const scope = this;

        let url = `?action=data&repoId=` + nodeProps.repoId + `&groupId=` + nodeProps.groupId + `&limit=100000`;

        // TODO: workaround to do not change mock
        if (scope.filterUrlParams && scope.filterUrlParams.length > 0) {
            url = url + '&sortField=time&sortDir=desc'
        }

        return this.#dao.readData(url + scope.filterUrlParams);
    }

}