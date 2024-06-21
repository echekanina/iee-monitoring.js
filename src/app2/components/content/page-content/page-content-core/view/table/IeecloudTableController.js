import IeecloudTableRenderer from "../../../page-content-renderer/view/table/IeecloudTableRenderer.js";
import IeecloudTableService from "./IeecloudTableService.js";
import {Grid} from "ag-grid-community";

export default class IeecloudTableController {
    #widgetContentModel;
    #systemController;
    #renderer;
    #tableService;
    #columnDefs;
    DEFAULT_TABLE_MODE = 'server';
    #mode;

    constructor(widgetContentModel, systemController, mode) {
        this.#widgetContentModel = widgetContentModel;
        this.#systemController = systemController;
        this.#mode = mode ? mode : this.DEFAULT_TABLE_MODE;
    }

    init(container, node) {
        const scope = this;
        let activeNode = node ? node : this.#systemController.getActiveNode();
        this.#renderer = new IeecloudTableRenderer(scope.#widgetContentModel, activeNode, scope.#mode);
        this.#renderer.render(container);

        const nodeProps = activeNode.properties;
        scope.#tableService = new IeecloudTableService(scope.#widgetContentModel.dataType, nodeProps);

        if (scope.#mode === 'server') {
            scope.#tableService?.buildColumnDefinitionsAndFilter(nodeProps, function (result) {
                scope.#columnDefs = result.columnDefs;
                scope.#renderer?.renderTable(result.columnDefs, container);
            });

            scope.#renderer.addEventListener('IeecloudTableRenderer.getRows', function (event) {
                const eventData = event.value;
                scope.#tableService?.getDataTable(activeNode, scope.#columnDefs, eventData.params,
                    function (data) {
                        scope.#renderer.renderPageData(eventData.params, data);
                    });
            });
        } else if (scope.#mode === "client") {
            scope.#tableService?.buildColumnDefinitionsAndFilter(nodeProps, function (result) {
                scope.#tableService?.getDataTable(activeNode, result.columnDefs, {
                    startRow: 0,
                    endRow: 10,
                    sortField: result.sortField,
                    sortDir: result.sortDir
                }, function (data) {
                    scope.#renderer?.renderTable(result.columnDefs, container, data.rowData);
                });
            });
        }

    }

    destroy() {
        this.#tableService?.abortRequest();
        this.#tableService = null;
        this.#renderer?.destroy();
        this.#renderer = null;
    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }


}