import IeecloudDocsPdfRenderer from "../../../page-content-renderer/view/docs/IeecloudDocsPdfRenderer.js";
import IeecloudDocsUnknownRenderer from "../../../page-content-renderer/view/docs/IeecloudDocsUnknownRenderer.js";

export default class IeecloudDocsController {
    #systemController;
    #renderer;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(container) {
        let activeNode = this.#systemController.getActiveNode();
        const filePath = activeNode.properties.path;
        if (filePath.indexOf(".pdf") !== -1) {
            this.#renderer = new IeecloudDocsPdfRenderer(activeNode);
        } else {
            this.#renderer = new IeecloudDocsUnknownRenderer(activeNode);
        }

        this.#renderer.render(container);
    }


    downloadDocument(){
        let activeNode = this.#systemController.getActiveNode();
        const filePath = activeNode.properties.path;
        let link = document.createElement("a");
        link.setAttribute('download', 'doc');
        link.href = import.meta.env.APP_STATIC_STORAGE + "/" + filePath;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    destroy() {
        this.#renderer.destroy();
        this.#renderer = null;
    }
}