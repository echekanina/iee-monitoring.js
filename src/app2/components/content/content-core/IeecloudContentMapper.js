import {IeecloudTreeDataParser, IeecloudTreeSchemeParser} from "ieecloud-tree";

export default class IeecloudContentMapper {

    map(contentSchemeFile, result) {
        const schemeParser = new IeecloudTreeSchemeParser();
        schemeParser.parse(contentSchemeFile, result);
        return IeecloudTreeSchemeParser;
    }

    mapData(contentDataFile, result) {
        const treeParser = new IeecloudTreeDataParser();
        treeParser.parse(result, contentDataFile);


        return IeecloudTreeDataParser.treeData;
    }


}