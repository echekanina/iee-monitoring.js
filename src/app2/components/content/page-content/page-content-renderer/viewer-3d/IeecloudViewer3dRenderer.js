import './styles/viewer-monitoring.scss';
import vertexMap from './mock/vertexMap.json'
import {eventBus} from "../../../../../main/index.js";
import IeecloudViewer3dService from "./IeecloudViewer3dService.js";
import {v4 as uuidv4} from "uuid";

export default class IeecloudViewer3dRenderer {
    #modelData;
    observableObject;
    #node;
    #renderModel;
    #systemController;
    #uuid;

    constructor(node, modelData, systemController) {
        this.#node = node;
        this.#modelData = modelData;
        this.#addEventListeners();

        this.#renderModel = this.#node.properties.viewerModel;

        if (this.#modelData !== "default") {
            this.#renderModel = this.#renderModel.replace(".zip", this.#modelData + ".zip");
        }

        this.#systemController = systemController;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div class="viewer-area">
<div class="viewer-zoom-top"><div class="viewer-zoom-control">
<a  title="Zoom in" role="button" aria-label="Zoom in" id="viewer-zoom-in-` + this.#uuid + `">+</a>
<a  title="Zoom out" role="button" aria-label="Zoom out" id="viewer-zoom-out-` + this.#uuid + `">−</a>
</div></div>
                                       <iframe type="text/html" src="./viewer-frame/viewer-wrapper.html?model=` + this.#renderModel + `" width="100%" height="550" id="3dframe_` + this.#uuid + `">
                                       </div>
                                    `;
    }

    render(container) {
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addDomListeners();
    }


    onShapeClicked = (objId) => {
        const data = {objId: objId, activeNode: this.#node}
        setTimeout(function () {
            eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
        }, 200)

    }


    receiveMessage = (event) => {
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();
        if (this.#node.id !== activeNode.id) {
            return;
        }
        const message = event.data.message;
        switch (message) {
            case 'getAppData':
                if (vertexMap[event.data.value]) {
                    this.onShapeClicked(vertexMap[event.data.value]);
                }
                break;
            case 'viewerLoaded':
                this.#loadData();
                break;
        }
    }

    destroy() {
        // TODO : add destroy prev model in viewer
        this.#removeEventListeners();
        this.#removeDomListeners();
    }

    #addEventListeners() {
        window.addEventListener("message", this.receiveMessage, false);
        window.addEventListener("viewerLoaded", this.receiveMessage, false);
    }

    #removeEventListeners() {
        window.removeEventListener("message", this.receiveMessage, false);
        window.removeEventListener("viewerLoaded", this.receiveMessage, false);
    }

    #loadData() {
        const scope = this;
        const nodeProps = this.#node.properties;
        const service = new IeecloudViewer3dService(nodeProps.dataService);
        if (this.#modelData === "default") {
            service.readScheme(nodeProps, function (result) {
                service.readData(nodeProps, result, function (data) {
                    const bodyContainerElement =document.getElementById("3dframe_" + scope.#uuid);
                    bodyContainerElement?.contentWindow.postMessage({data : data});
                });
            });
        }
    }

    fullScreen() {
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }

    #zoomInListener = (event) => {
        const bodyContainerElement =  document.getElementById("3dframe_" + this.#uuid);
        bodyContainerElement?.contentWindow.postMessage({zoomIn : true});
    }

    #zoomOutListener = (event) => {
        const bodyContainerElement =  document.getElementById("3dframe_" + this.#uuid);
        bodyContainerElement?.contentWindow.postMessage({zoomOut : true});
    }

    #addDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#viewer-zoom-in-" + this.#uuid);
        zoomIn?.addEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#viewer-zoom-out-" + this.#uuid);
        zoomOut?.addEventListener('click', scope.#zoomOutListener);
    }

    #removeDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#viewer-zoom-in-" + this.#uuid);
        zoomIn?.removeEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#viewer-zoom-out-" + this.#uuid);
        zoomOut?.removeEventListener('click', scope.#zoomOutListener);
    }
}