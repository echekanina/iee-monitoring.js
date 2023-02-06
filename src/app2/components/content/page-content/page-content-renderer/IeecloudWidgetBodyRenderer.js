import IeecloudTableRenderer from "./table/IeecloudTableRenderer.js";
import IeecloudViewer2dRenderer from "./viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer3dRenderer from "./viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudDummyRenderer from "./dummy/IeecloudDummyRenderer.js";
import IeecloudMapRenderer from "./map/IeecloudMapRenderer.js";
import {IeecloudChartPairRenderer} from "./chart-pair/IeecloudChartPairRenderer.js";

export default class IeecloudWidgetBodyRenderer {
    #layoutModel;
    #node;
    #container;
    #params;
    #viewType;
    #modelData;
    #mapType;
    #view;
    #systemController;

    constructor(containerId, layoutModel, node, systemController) {
        this.#layoutModel = layoutModel;
        this.#node = node;
        this.#container = document.querySelector("#" + containerId);
        this.#viewType = (this.#node.properties.defaultView && this.#node.properties.defaultView !== '') ?
            this.#node.properties.defaultView : layoutModel.view;
        this.#modelData = layoutModel.model;
        this.#mapType = layoutModel.map;
        this.#systemController = systemController;
    }

    generateTemplate() {
        return ` <div  class="widget-body-content" id="widget-body-` + this.#layoutModel.id + `">
                                    </div>`;
    }

    render() {
        this.#container.innerHTML = '';
        const widgetBodyTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', widgetBodyTemplate);


        const fullScreen = document.querySelector("#full-screen");

        if (fullScreen) {
            fullScreen.classList.add("d-none");
        }

        this.destroy();

        switch (this.#viewType) {
            case "table":
                this.#view = new IeecloudTableRenderer(this.#layoutModel, this.#node);
                break
            case "viewer-2d":
                this.#view = new IeecloudViewer2dRenderer(this.#node, this.#modelData);
                break
            case "viewer-3d":
                this.#view = new IeecloudViewer3dRenderer(this.#node, this.#modelData, this.#systemController);
                break
            case "map":
                this.#view = new IeecloudMapRenderer(this.#node, this.#mapType);
                break
            case "chart":
                this.#view = new IeecloudChartPairRenderer(this.#node);
                break
            default:
                this.#view = new IeecloudDummyRenderer(this.#layoutModel, this.#node);
        }

        const bodyContainerElement = document.querySelector("#widget-body-" + this.#layoutModel.id);
        this.#view.render(bodyContainerElement);
    }

    destroy() {
        if (this.#view) {
            this.#view.destroy();
        }
    }

    get viewType() {
        return this.#viewType;
    }

    get modelData() {
        return this.#modelData;
    }

    get mapType() {
        return this.#mapType;
    }

    set viewType(viewType) {
        this.#viewType = viewType;
    }

    set modelData(modelData) {
        this.#modelData = modelData;
    }

    set mapType(mapType) {
        this.#mapType = mapType;
    }
}