import IeecloudViewer3dRenderer from "../../../page-content-renderer/view/viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudMapRenderer from "../../../page-content-renderer/view/map/IeecloudMapRenderer.js";
import IeecloudMapService from "./IeecloudMapService.js";

export default class IeecloudMapRendererController {
    #mapType;
    #systemController;
    #renderer;
    constructor(mapType, systemController) {
        this.#mapType = mapType;
        this.#systemController = systemController;
    }

    init(container){
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const mapService = new IeecloudMapService(nodeProps.dataService);
        mapService.readSettingsFile(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_MAP_ZOOM, function (zoomMap) {
            mapService.readSettingsFile(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_MAP_TYPE_SETTINGS, function (mapSettings) {
                scope.#renderer = new IeecloudMapRenderer(activeNode, scope.#mapType, zoomMap, mapSettings);
                scope.#renderer.render(container);

            });
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

    changeViewType(value){
        if(this.#renderer.changeViewType){
            this.#renderer.changeViewType(value);
        }
    }

}