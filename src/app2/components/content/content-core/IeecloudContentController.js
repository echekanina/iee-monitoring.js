import IeecloudContentRenderer from "../content-renderer/IeecloudContentRenderer.js";
import IeecloudBreadcrumbController from "../breadcrumb/breadcrumb-core/IeecloudBreadcrumbController.js";
import IeecloudPageContentController from "../page-content/page-content-core/IeecloudPageContentController.js";
import {Modal} from 'bootstrap';
import {eventBus} from "../../../main/index.js";
import {cloneDeep} from "lodash-es";
import IeecloudAppUtils from "../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudContentController {
    #systemController;
    #schemeModel;
    #layoutModel;
    #pageContentController;

    #USER_WIDGET_SETTINGS_STORAGE_KEY = "userWidgetSettings";
    #storedUserSettingsKeyAddition;
    #contentRenderer;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#storedUserSettingsKeyAddition  = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__ + '_' + this.#systemController.modelId;
    }

    init(containerId, layout) {
        const scope = this;
        scope.#layoutModel = layout;

        let lastActiveNode = this.#systemController.getActiveNode();
        console.log(scope.#layoutModel, )
        let layoutModel = scope.#layoutModel[lastActiveNode?.schemeId];

        if (!layoutModel) {
            console.error(`Layout model with schemeId ${lastActiveNode?.schemeId} not found. Please set default active node in tree-settings.json`)
            return;
        }

        let modalDialogs = {};

        scope.#contentRenderer = new IeecloudContentRenderer(containerId, layoutModel.dialog);
        const systemModel = this.#systemController.getTreeModel();
        scope.#contentRenderer.render(systemModel);

        const breadcrumbController = new IeecloudBreadcrumbController(this.#schemeModel, this.#systemController);
        breadcrumbController.init(scope.#contentRenderer.breadcrumbContainerId);

        scope.#pageContentController = new IeecloudPageContentController(this.#systemController, scope.#layoutModel);

        let prevUserWidgetSetting;
        const storedString = localStorage.getItem(scope.#USER_WIDGET_SETTINGS_STORAGE_KEY + scope.#storedUserSettingsKeyAddition);
        if (storedString) {
            prevUserWidgetSetting = IeecloudAppUtils.parseJsonWithMoment(storedString);
        }
        scope.#pageContentController.init(scope.#contentRenderer.pageContentContainerId, prevUserWidgetSetting);

        if (layoutModel.dialog) {
            scope.#showModal(modalDialogs, lastActiveNode);
        }

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

            const isNodeWasDestroyed = scope.#pageContentController.isDestroyed(activeNode.id);

            const prevActive = scope.#systemController.getPrevActiveNode();
            let prevUserWidgetSetting;

            if (!prevActive?.hasChildren()) {
                prevUserWidgetSetting = scope.#pageContentController.getPreviousUserWidgetSettings(prevActive.id);
                localStorage.setItem(scope.#USER_WIDGET_SETTINGS_STORAGE_KEY + scope.#storedUserSettingsKeyAddition, JSON.stringify(prevUserWidgetSetting));
            } else {
                const storedString = localStorage.getItem(scope.#USER_WIDGET_SETTINGS_STORAGE_KEY + scope.#storedUserSettingsKeyAddition);
                if (storedString) {
                    prevUserWidgetSetting = IeecloudAppUtils.parseJsonWithMoment(storedString);
                }
            }

            if (!layoutModel.dialog) {
                if (isNodeWasDestroyed) {
                    scope.#contentRenderer.destroy();
                    scope.#pageContentController.destroy();
                    let backdropElement = document.getElementsByClassName('modal-backdrop')[0];
                    backdropElement?.remove();
                } else {
                    const prevActive = scope.#systemController.getPrevActiveNode();

                    if (modalDialogs[prevActive.id] && modalDialogs[prevActive.id]._isShown) {
                        scope.#pageContentController.destroyNode(prevActive.id);
                        modalDialogs[prevActive.id].dispose();
                        const modalElement = document.getElementById(scope.#contentRenderer.pageContentModalId);
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
                scope.#contentRenderer.isDialog = layoutModel.dialog;
                scope.#contentRenderer.render(systemModel);
                breadcrumbController.buildContent(scope.#contentRenderer.breadcrumbContainerId);
                scope.#pageContentController.buildPageContent(scope.#contentRenderer.pageContentContainerId, prevUserWidgetSetting);
            }

            if (layoutModel.dialog && isNodeWasDestroyed) {
                scope.#showModal(modalDialogs, activeNode);
            }
        });

        eventBus.on('IeecloudContentOptionsController.layoutChanged', function (layout) {
            scope.#layoutModel = cloneDeep(layout);
        });
    }

    destroy(){
        this.#contentRenderer.destroy();
        this.#pageContentController.destroy();
    }

    #showModal(modalDialogs, activeNode) {
        const scope = this;
        const modalElement = document.getElementById(scope.#contentRenderer.pageContentModalId);
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
            scope.#pageContentController.destroyNode(activeNode.id);
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
}