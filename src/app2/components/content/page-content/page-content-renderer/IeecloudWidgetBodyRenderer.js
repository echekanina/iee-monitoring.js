import IeecloudTableRenderer from "./table/IeecloudTableRenderer.js";
import IeecloudViewer2dRenderer from "./viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer3dRenderer from "./viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudDummyRenderer from "./dummy/IeecloudDummyRenderer.js";
import IeecloudMapRenderer from "./map/IeecloudMapRenderer.js";
import IeecloudChartRenderer from "./chart/IeecloudChartRenderer.js";
import {IeecloudChartPairRenderer} from "./chart-pair/IeecloudChartPairRenderer.js";

export default class IeecloudWidgetBodyRenderer {
    #layoutModel;
    #node;
    #container;
    #params;
    #viewType;

    constructor(layoutModel, node, container) {
        this.#layoutModel = layoutModel;
        this.#node = node;
        this.#container = container;
        this.#viewType = layoutModel.type;
    }

    generateTemplate() {
        return ` <div class="widget-body-content" id="widget-body-` + this.#layoutModel.id + `">
                                    </div>`;
    }

    render() {
        const widgetBodyTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', widgetBodyTemplate);

        let view;

        switch (this.#viewType) {
            case "table":
                view = new IeecloudTableRenderer(this.#layoutModel, this.#node);
                break
            case "viewer-2d":
                view = new IeecloudViewer2dRenderer(this.#layoutModel, this.#node);
                break
            case "viewer-3d":
                view = new IeecloudViewer3dRenderer(this.#node, this.#params);
                break
            case "map":
                view = new IeecloudMapRenderer(this.#node, this.#params);
                break
            case "chart":
                view = new IeecloudChartPairRenderer(this.#node);
                break


            default:
                view = new IeecloudDummyRenderer(this.#layoutModel, this.#node);
        }
        const bodyContainerElement = document.querySelector("#widget-body-" + this.#layoutModel.id);
        view.render(bodyContainerElement);
    }

    switchView(type, params) {
        if (type !== this.#viewType) {
            this.#viewType = type;
            this.#params = params;
            this.render();
        }

    }
}