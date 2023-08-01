import IeecloudViewer3dRenderer from "../../../page-content-renderer/view/viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudChartPairService from "../chart-pair/IeecloudChartPairService.js";
import {IeecloudChartPairRenderer} from "../../../page-content-renderer/view/chart-pair/IeecloudChartPairRenderer.js";
import IeecloudViewer3dService from "./IeecloudViewer3dService.js";

export default class IeecloudViewer3dController {
    #modelData;
    #systemController;
    #renderer;
    constructor(modelData, systemController) {
        this.#modelData = modelData;
        this.#systemController = systemController;
    }

    init(container){
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const service = new IeecloudViewer3dService(nodeProps.dataService);
        service.readVertex(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_3D_VERTEX_FILE_NAME, function (vertexMap) {
            scope.#renderer = new IeecloudViewer3dRenderer(activeNode, scope.#modelData, scope.#systemController, vertexMap);
            scope.#renderer.render(container);
        });
    }

    destroy(){
        this.#renderer.destroy();
    }

    fullScreen(){
        if(this.#renderer.fullScreen){
            this.#renderer.fullScreen();
        }
    }


}