import IeecloudAlbumService from "./IeecloudAlbumService.js";
import IeecloudAlbumRenderer from "../../../page-content-renderer/view/album/IeecloudAlbumRenderer.js";

export default class IeecloudAlbumController {
    #systemController;
    #renderer;
    #service;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const modelId = this.#systemController.modelId;
        this.#service = new IeecloudAlbumService(modelId);


        this.#renderer = new IeecloudAlbumRenderer(activeNode);
        this.#renderer.render(container);


        this.#service.readScheme(nodeProps, function (result) {
            scope.#service.readData(nodeProps, result, function (data) {
                scope.#renderer.renderAlbum(data, container);
            });
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