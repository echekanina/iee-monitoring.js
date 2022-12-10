import {IeecloudTreeDataParser, IeecloudTreeSchemeParser} from "ieecloud-tree";

export default class IeecloudAppMapper {
    #sideBarIconsMap;

    constructor() {
        this.#sideBarIconsMap = {};

        this.#sideBarIconsMap["mo1"] = 'fas fa-fw fa-tachometer-alt';
        this.#sideBarIconsMap["an1"] = 'fas fa-fw fa-chart-area';
        this.#sideBarIconsMap["repo1"] = 'fas fa-fw fa-table';
        this.#sideBarIconsMap["event1"] = 'fas fa-fw fa-calendar';

    }

    map(appSchemeFile, result) {
        const schemeParser = new IeecloudTreeSchemeParser();
        schemeParser.parse(appSchemeFile, result);
        return IeecloudTreeSchemeParser;
    }

    mapData(appDataFile, result) {
        const treeParser = new IeecloudTreeDataParser();
        treeParser.parse(result, appDataFile);
        return IeecloudTreeDataParser.treeData;
    }


}