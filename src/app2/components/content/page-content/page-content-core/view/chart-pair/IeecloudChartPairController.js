import IeecloudMapRenderer from "../../../page-content-renderer/view/map/IeecloudMapRenderer.js";
import {IeecloudChartPairRenderer} from "../../../page-content-renderer/view/chart-pair/IeecloudChartPairRenderer.js";
import IeecloudMapService from "../map/IeecloudMapService.js";
import IeecloudChartPairService from "./IeecloudChartPairService.js";

export default class IeecloudChartPairController {
    #systemController;
    #renderer;


    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const service = new IeecloudChartPairService(nodeProps.dataService);
        service.readSettingsFile(import.meta.env.VITE_APP_SERVER_URL, import.meta.env.VITE_CONTENT_CHART_LAYOUT, function (chartLayout) {
            scope.#renderer = new IeecloudChartPairRenderer(activeNode, chartLayout);
            scope.#renderer.render(container);

        });
    }

    destroy() {
        this.#renderer.destroy();
    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }


}