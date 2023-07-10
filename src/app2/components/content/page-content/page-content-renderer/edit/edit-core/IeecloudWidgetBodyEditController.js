import IeecloudWidgetBodyEditRenderer from "../edit-renderer/IeecloudWidgetBodyEditRenderer.js";
import IeecloudWidgetBodyEditService from "../edit-renderer/IeecloudWidgetBodyEditService.js";

export default class IeecloudWidgetEditBodyController {
    #widgetBodyEditRenderer;
    #widgetBodyController;
    #systemController;
    constructor(widgetBodyController, systemController) {
        this.#widgetBodyController = widgetBodyController;
        this.#systemController = systemController;
    }

    init(containerId, saveBtnId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const widgetBodyEditService = new IeecloudWidgetBodyEditService(nodeProps.dataService, nodeProps);
        this.#widgetBodyEditRenderer = new IeecloudWidgetBodyEditRenderer(containerId, activeNode, 'NEW', widgetBodyEditService);
        this.#widgetBodyEditRenderer.render();
        const editContainer = document.querySelector("#" + saveBtnId);
        editContainer?.addEventListener('click', function(){
            widgetBodyEditService.saveData(scope.#widgetBodyEditRenderer.getDataToSave());
        });
    }
}