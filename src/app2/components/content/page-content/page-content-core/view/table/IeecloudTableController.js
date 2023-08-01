import IeecloudTableRenderer from "../../../page-content-renderer/view/table/IeecloudTableRenderer.js";

export default class IeecloudTableController {
    #widgetContentModel;
    #systemController;
    #renderer;
    constructor(widgetContentModel, systemController) {
        this.#widgetContentModel = widgetContentModel;
        this.#systemController = systemController;
    }

    init(container){
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudTableRenderer(this.#widgetContentModel, activeNode);
        this.#renderer.render(container);
    }

    destroy(){
        this.#renderer.destroy();
    }

    fullScreen(){
        if(this.#renderer.fullScreen){
            this.#renderer.fullScreen();
        }
    }


}