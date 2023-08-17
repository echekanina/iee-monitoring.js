import IeecloudWidgetBodyEditRenderer from "../../../page-content-renderer/view/edit/IeecloudWidgetBodyEditRenderer.js";
import IeecloudWidgetBodyEditService from "./IeecloudWidgetBodyEditService.js";

export default class IeecloudWidgetEditBodyController {
    #renderer;
    #systemController;
    #mode;
    #widgetBodyEditService;
    #modal;
    #saveBtnId;
    #widgetBodyController;


    constructor(systemController, mode, widgetBodyController) {
        this.#systemController = systemController;
        this.#mode = mode;
        this.#widgetBodyController = widgetBodyController;
    }

    init(container, saveBtnId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#widgetBodyEditService = new IeecloudWidgetBodyEditService(nodeProps);
        this.#renderer = new IeecloudWidgetBodyEditRenderer(activeNode, scope.#mode);
        this.#renderer.render(container);

        scope.#widgetBodyEditService.buildColumnDefinitionsAndFilter(nodeProps, scope.#mode, function (result) {
            scope.#renderer.renderFilter(result)

            if (scope.#mode === 'NEW') {
                scope.#renderer.renderNewSheetTable(result);
                scope.#saveBtnId = saveBtnId;
                const editContainer = document.querySelector("#" + scope.#saveBtnId);
                editContainer?.addEventListener('click', scope.#saveModalClickListener);
                return;
            }

            scope.#widgetBodyEditService.getEditDataTable(nodeProps, result.columnDefs, function (data) {
                scope.#renderer.renderEditSheetTable(data)

            });
        });

    }

    #saveModalClickListener = (event) => {
        let scope = this;
        scope.#widgetBodyEditService.saveData(scope.#renderer.getDataToSave(), function () {
            scope.#modal?.hide();
        });
    }

    setModal(modal) {
        this.#modal = modal;
    }

    destroy() {
        let scope = this;
        if (scope.#mode === 'NEW') {
            const editContainer = document.querySelector("#" + scope.#saveBtnId);
            editContainer?.removeEventListener('click', scope.#saveModalClickListener);
        }
        this.#renderer.destroy();
    }

    saveEditedData() {
        const scope = this;
        scope.#widgetBodyEditService.updateData(scope.#renderer.getDataToSave(), function () {
            scope.#widgetBodyController?.switchView('table');
        });
    }

}