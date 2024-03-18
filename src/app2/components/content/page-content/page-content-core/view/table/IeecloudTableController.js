import IeecloudTableRenderer from "../../../page-content-renderer/view/table/IeecloudTableRenderer.js";
import IeecloudTableService from "./IeecloudTableService.js";
import {Grid} from "ag-grid-community";

export default class IeecloudTableController {
    #widgetContentModel;
    #systemController;
    #renderer;
    #tableService;
    #columnDefs;
    constructor(widgetContentModel, systemController) {
        this.#widgetContentModel = widgetContentModel;
        this.#systemController = systemController;
    }

    init(container){
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudTableRenderer(scope.#widgetContentModel, activeNode);
        this.#renderer.render(container);

        const nodeProps = activeNode.properties;
        scope.#tableService = new IeecloudTableService(scope.#widgetContentModel.dataType, nodeProps);
        scope.#tableService.buildColumnDefinitionsAndFilter(nodeProps, function (result) {
            scope.#columnDefs = result.columnDefs;
            scope.#renderer?.renderTable(result.columnDefs, container);
        });

        scope.#renderer.addEventListener('IeecloudTableRenderer.getRows', function (event) {
            const eventData = event.value;
            scope.#tableService.getDataTable(activeNode, scope.#columnDefs, eventData.params,
                function (data) {
                    scope.#renderer.renderPageData(eventData.params, data);
            });
        });
    }

    destroy() {
        this.#tableService.abortRequest();
        this.#tableService = null;
        this.#renderer.destroy();
        this.#renderer = null;
    }

    fullScreen(){
        if(this.#renderer.fullScreen){
            this.#renderer.fullScreen();
        }
    }


}