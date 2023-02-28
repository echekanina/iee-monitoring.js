import {IeecloudSearchBlockRenderer} from "./IeecloudSearchBlockRenderer.js";
import {eventBus} from "../../../main/index.js";

export class IeecloudSearchBlockController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;

    }

    init(searchBlockLgContainerId, searchBlockSmContainerId) {
        const searchBlockRenderer = new IeecloudSearchBlockRenderer(searchBlockLgContainerId);
        searchBlockRenderer.render();

        const searchBlockRendererSm = new IeecloudSearchBlockRenderer(searchBlockSmContainerId);
        searchBlockRendererSm.render();

        this.#addRenderListeners(searchBlockRenderer);
        this.#addRenderListeners(searchBlockRendererSm);



    }

    #addRenderListeners(renderer) {
        const scope = this;

        renderer.addEventListener('IeecloudSearchBlockRenderer.searchNode', function (event) {
            const searchText = event.value;
            if (scope.#systemController["childSystemController"]) {
                const nodes = scope.#systemController["childSystemController"].searchNode(searchText);
                renderer.drawAutoComplete(nodes);
            }
        });

        renderer.addEventListener('IeecloudSearchBlockRenderer.setActiveNode', function (event) {
            const nodeId = event.value.value;
            if (nodeId) {
                eventBus.emit('IeecloudSearchBlockController.itemClicked', nodeId, false);
            }
            const width = Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            )
            if (width < 992) {
                const wrapper = document.querySelector("#wrapper");
                wrapper?.classList.add("tree-toggled");
                const treeModelShow = document.querySelector("#tree-model-show-btn");
                if (treeModelShow) {
                    treeModelShow.style.display = 'flex';
                }
            }
        });

    }
}