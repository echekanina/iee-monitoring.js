import IeecloudViewer3dRenderer from "../../../page-content-renderer/view/viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudViewer3dService from "./IeecloudViewer3dService.js";
import {eventBus} from "../../../../../../main/index.js";

export default class IeecloudViewer3dController {
    #modelData;
    #systemController;
    #renderer;
    #vertexMap;
    #viewerLoaded = false;
    #service;
    #node;

    constructor(modelData, systemController) {
        this.#modelData = modelData;
        this.#systemController = systemController;
    }

    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        this.#node = activeNode;
        scope.#service = new IeecloudViewer3dService(nodeProps.dataService);
        scope.#service.readVertex(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_3D_VERTEX_FILE_NAME, function (vertexMap) {
            scope.#vertexMap = vertexMap;

            let renderModel = scope.#node.properties.viewerModel;
            if (scope.#modelData !== "default") {
                renderModel = renderModel.replace(".zip", scope.#modelData + ".zip");
            }

            scope.#renderer = new IeecloudViewer3dRenderer(renderModel);
            scope.#renderer.render(container);
            scope.#addEventListeners();
        });
    }

    receiveMessage = (event) => {
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();
        if (scope.#node.id !== activeNode.id) {
            return;
        }
        const message = event.data.message;
        switch (message) {
            case 'getAppData':
                if (scope.#vertexMap[event.data.value]) {
                    this.onShapeClicked(scope.#vertexMap[event.data.value]);
                }
                break;
            case 'viewerLoaded':
                scope.#viewerLoaded = true;
                scope.#renderer.setViewerLoaded(scope.#viewerLoaded);
                scope.#loadData();
                break;
        }
    }

    onShapeClicked = (objId) => {
        const data = {objId: objId, activeNode: this.#node}
        setTimeout(function () {
            eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
        }, 200)

    }

    #addEventListeners() {
        window.addEventListener("message", this.receiveMessage, false);
        window.addEventListener("viewerLoaded", this.receiveMessage, false);
    }

    #removeEventListeners() {
        window.removeEventListener("message", this.receiveMessage, false);
        window.removeEventListener("viewerLoaded", this.receiveMessage, false);
    }

    destroy() {
        this.#viewerLoaded = false;
        this.#renderer.setViewerLoaded(this.#viewerLoaded);
        this.#removeEventListeners();
        this.#renderer.destroy();
    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }
    #loadData() {
        const scope = this;
        const nodeProps = scope.#node.properties;
        if (scope.#modelData === "default") {
            scope.#service.readScheme(nodeProps, function (result) {
                scope.#service.readData(nodeProps, result, function (data) {
                    scope.#renderer.loadData(data);
                });
            });
        }
    }
}