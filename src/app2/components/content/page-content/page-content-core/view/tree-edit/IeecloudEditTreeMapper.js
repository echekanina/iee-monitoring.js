import {IeecloudTreeDataParser, IeecloudTreeSchemeParser} from "ieecloud-tree";

export default class IeecloudEditTreeMapper {

    #schemeParser = new IeecloudTreeSchemeParser();
    #treeParser = new IeecloudTreeDataParser();

    map(contentSchemeFile, result) {
        this.#schemeParser.parse(contentSchemeFile, result);
        return IeecloudTreeSchemeParser;
    }

    mapData(contentDataFile, result) {
        this.#treeParser.parse(result, contentDataFile);
        return IeecloudTreeDataParser.treeData;
    }

    mapDataToSave(treeModel) {
        return this.#treeParser.modelToJson(IeecloudTreeSchemeParser.fileName, treeModel);
    }
}