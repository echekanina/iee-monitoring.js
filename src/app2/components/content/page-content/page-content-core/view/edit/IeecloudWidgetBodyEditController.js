import IeecloudWidgetBodyEditRenderer from "../../../page-content-renderer/view/edit/IeecloudWidgetBodyEditRenderer.js";
import IeecloudWidgetBodyEditService from "./IeecloudWidgetBodyEditService.js";

export default class IeecloudWidgetEditBodyController {
    #renderer;
    #systemController;
    #mode;
    #widgetBodyEditService;

    constructor(systemController, mode) {
        this.#systemController = systemController;
        this.#mode = mode;
    }

    init(container, saveBtnId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#widgetBodyEditService = new IeecloudWidgetBodyEditService(nodeProps.dataService, nodeProps);
        this.#renderer = new IeecloudWidgetBodyEditRenderer(activeNode, scope.#mode);
        this.#renderer.render(container);

        scope.#widgetBodyEditService.buildColumnDefinitionsAndFilter(nodeProps, scope.#mode, function (result) {
            scope.#renderer.renderFilter(result)

            if (scope.#mode === 'NEW') {
                scope.#renderer.renderNewSheetTable(result)
                const editContainer = document.querySelector("#" + saveBtnId);
                editContainer?.addEventListener('click', function () {
                    scope.#widgetBodyEditService.saveData(scope.#renderer.getDataToSave());
                });
                return;
            }

            scope.#widgetBodyEditService.getEditDataTable(nodeProps, result.columnDefs, function (data) {
                scope.#renderer.renderEditSheetTable(data)

            });
        });

    }

    destroy() {
        this.#renderer.destroy();
    }

    saveEditedData() {
        const scope = this;
        // TODO: clear after save
        // scope.#changedRows = [];
        scope.#widgetBodyEditService.updateData(scope.#renderer.getDataToSave(), function () {
            // TODO: go to readonly view
        });
    }

}