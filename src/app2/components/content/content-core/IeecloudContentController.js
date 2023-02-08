import IeecloudContentRenderer from "../content-renderer/IeecloudContentRenderer.js";
import IeecloudBreadcrumbController from "../breadcrumb/breadcrumb-core/IeecloudBreadcrumbController.js";
import IeecloudPageContentController from "../page-content/page-content-core/IeecloudPageContentController.js";
import {Modal} from 'bootstrap';
import {eventBus} from "../../../main/index.js";
import {cloneDeep} from "lodash-es";

export default class IeecloudContentController {
    #systemController;
    #schemeModel;

    #DEFAULT_ACTIVE_NODE_ID = 1 + "";
    #layoutModel;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, layout) {
        const scope = this;
        scope.#layoutModel = layout;
        this.#systemController.setActiveNode(scope.#DEFAULT_ACTIVE_NODE_ID);
        let lastActiveNode = this.#systemController.getActiveNode();
        let layoutModel = scope.#layoutModel[lastActiveNode.schemeId];

        let modalDialogs = {};

        const contentRenderer = new IeecloudContentRenderer(containerId, layoutModel.dialog);
        const systemModel = this.#systemController.getTreeModel();
        contentRenderer.render(systemModel);

        const breadcrumbController = new IeecloudBreadcrumbController(this.#schemeModel, this.#systemController);
        breadcrumbController.init(contentRenderer.breadcrumbContainerId);

        const pageContentController = new IeecloudPageContentController(this.#systemController, scope.#layoutModel);
        pageContentController.init(contentRenderer.pageContentContainerId);

        // TODO: refactor

        scope.#systemController.on('tree.activeNodeSet', function (node) {

            if (document.fullscreenElement) {
                document.exitFullscreen()
                    .then(() => console.debug("Document Exited from Full screen mode"))
                    .catch((err) => console.error(err))
            }

            const body = document.getElementById("page-top");
            body?.classList.remove('modal-open')
            body?.removeAttribute('style');

            const activeNode = scope.#systemController.getActiveNode();
            let layoutModel = scope.#layoutModel[activeNode.schemeId];
            const systemModel = scope.#systemController.getTreeModel();

            const isNodeWasDestroyed = pageContentController.isDestroyed(activeNode.id);


            if (!layoutModel.dialog) {
                if (isNodeWasDestroyed) {
                    contentRenderer.destroy();
                    pageContentController.destroy();
                    let backdropElement = document.getElementsByClassName('modal-backdrop')[0];
                    backdropElement?.remove();
                } else {
                    const prevActive = scope.#systemController.getPrevActiveNode();

                    if (modalDialogs[prevActive.id] && modalDialogs[prevActive.id]._isShown) {
                        pageContentController.destroyNode(prevActive.id);
                        modalDialogs[prevActive.id].dispose();
                        const modalElement = document.getElementById(contentRenderer.pageContentModalId);
                        modalElement?.remove();
                        const body = document.getElementById("page-top");
                        body?.classList.remove('modal-open')
                        body?.removeAttribute('style');
                        let backdropElement = document.getElementsByClassName('modal-backdrop')[0];
                        backdropElement?.remove();
                        delete modalDialogs[prevActive.id];
                    }
                }
            }

            if (isNodeWasDestroyed) {
                contentRenderer.isDialog = layoutModel.dialog;
                contentRenderer.render(systemModel);
                breadcrumbController.buildContent(contentRenderer.breadcrumbContainerId);
                pageContentController.buildPageContent(contentRenderer.pageContentContainerId);
            }

            if (layoutModel.dialog && isNodeWasDestroyed) {

                const modalElement = document.getElementById(contentRenderer.pageContentModalId);
                let pageContentModal = new Modal(modalElement, {
                    focus: false,
                    backdrop: 'static'
                })
                pageContentModal.show();

                if (!modalDialogs.hasOwnProperty(activeNode.id)) {
                    modalDialogs[activeNode.id] = pageContentModal;
                }

                modalElement?.addEventListener('hidden.bs.modal', function (event) {
                    const activeNode = scope.#systemController.getActiveNode();
                    pageContentController.destroyNode(activeNode.id);
                    pageContentModal?.dispose();
                    modalElement?.remove();
                    delete modalDialogs[activeNode.id];
                    const prevActive = scope.#systemController.getPrevActiveNode();
                    if (prevActive && prevActive.parent?.id !== activeNode.id) {
                        scope.#systemController.setActiveNode(prevActive.id)
                    } else {
                        scope.#systemController.setActiveNode(activeNode.parent?.id)
                    }


                });
            }
        });


        eventBus.on('IeecloudTableRenderer.rowClick', function (data) {
// TODO:add search by id to tree lib
            if (data.hasOwnProperty("objId") && data.objId !== '') {
                scope.#goToNewStateById(data.objId?.toString())
            }


        });

        eventBus.on('IeecloudSearchBlockController.itemClicked', function (nodeId) {
            scope.#goToNewStateById(nodeId);
        });

        eventBus.on('IeecloudContentOptionsController.layoutChanged', function (layout) {
            scope.#layoutModel = cloneDeep(layout);
        });
    }

    #goToNewStateById(nodeId) {
        const scope = this;

        const newActiveNode = scope.#systemController.getNodeById(nodeId);
        const activeNode = this.#systemController.getActiveNode();
        let layoutModel = scope.#layoutModel[activeNode.schemeId];
        if (layoutModel.dialog) {
            if (newActiveNode) {
                this.#systemController.setActiveNode(newActiveNode.id);
            }
        } else {
            if (newActiveNode && activeNode.id !== newActiveNode.id) {
                this.#systemController.setActiveNode(newActiveNode.id);
            }
        }

    }
}