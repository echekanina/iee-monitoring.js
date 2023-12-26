import IeecloudWidgetRenderer from "../../../page-content-renderer/row/widget/IeecloudWidgetRenderer.js";
import IeecloudWidgetBodyController from "./body/IeecloudWidgetBodyController.js";
import IeecloudWidgetActionsController from "../../actions/IeecloudWidgetActionsController.js";
import {eventBus} from "../../../../../../main/index.js";
import IeecloudWidgetBtnActionController from "../../actions/IeecloudWidgetBtnActionController.js";
import IeecloudWidgetMultiActionsController from "../../actions/IeecloudWidgetMultiActionsController.js";
import {Modal} from "bootstrap";
import IeecloudWidgetEditBodyController from "../../view/edit/IeecloudWidgetBodyEditController.js";

export default class IeecloudWidgetController {
    #widgetModel;
    #systemController;
    #widgetBodyControllers = [];
    #widgetRenderer;
    #widgetActionsControllers = [];

    constructor(widgetModel, systemController) {
        this.#widgetModel = widgetModel;
        this.#systemController = systemController;

    }

    init(containerId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#widgetRenderer = new IeecloudWidgetRenderer(containerId, this.#widgetModel, activeNode);
        scope.#widgetRenderer.render();

        let widgetBodyController;
        if (this.#widgetModel.widgetContent) {
            widgetBodyController = new IeecloudWidgetBodyController(this.#widgetModel.widgetContent, this.#systemController);
            widgetBodyController.init(scope.#widgetRenderer.cardBodyContainer,this.#widgetModel);
            scope.#widgetBodyControllers.push(widgetBodyController);
        }

        if (this.#widgetModel.viewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, widgetBodyController, this.#widgetModel.viewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewActionsContainer);
        }

        if (this.#widgetModel.modelDataActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, widgetBodyController, this.#widgetModel.modelDataActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.modelDataActionsContainer);
        }

        if (this.#widgetModel.mapViewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, widgetBodyController, this.#widgetModel.mapViewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewMapActionsContainer);
        }

        if (this.#widgetModel.availableRepos && this.#widgetModel.availableRepos[nodeProps.type]) {
            const widgetHeaderActionsController = new IeecloudWidgetMultiActionsController(widgetBodyController, this.#widgetModel.availableRepos[nodeProps.type]);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewEventsStoresContainer);
            scope.#widgetActionsControllers.push(widgetHeaderActionsController);
        }

        if (this.#widgetModel.fullScreenEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.fullScreenBtn, function(){
                widgetBodyController.fullScreen();
            });
        }

        if (this.#widgetModel.add2DNodesEnabled) {
            const widgetHeaderTurnAddModeBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderTurnAddModeBtnActionController.init(scope.#widgetRenderer.add2ВChildNodes, function(){
                scope.#widgetRenderer.add2DMode = !scope.#widgetRenderer.add2DMode;
                const title = scope.#widgetRenderer.add2DMode ? scope.#widgetModel.add2DNodesEnabledTurnOffTitle : scope.#widgetModel.add2DNodesEnabledTurnTitle
                scope.#widgetRenderer.toggleTurnBtnLink(scope.#widgetRenderer.add2ВChildNodes, title,  scope.#widgetRenderer.add2DMode);
                widgetBodyController.toggleAddChildNodes(scope.#widgetRenderer.add2DMode, scope.#widgetRenderer.edit2dNodesContainers);
            });
        }


        if (this.#widgetModel.editEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.editSaveBtn, function(){
                widgetBodyController.saveEditedData();
            });
        }

        if (this.#widgetModel.editEnabled  && activeNode.properties.editTreeMode) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.addNewTreeBtn, function(){
                widgetBodyController.createNewTree();
            });
        }

        if (this.#widgetModel.editEnabled && activeNode.properties.editMode) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.editStoreBtn, function(){
                const modalElement = document.getElementById(scope.#widgetRenderer.editStoreModal);
                let pageContentModal = new Modal(modalElement);
                pageContentModal.show();

                const widgetBodyEditController = new IeecloudWidgetEditBodyController(scope.#systemController, 'NEW');
                const container = document.querySelector("#" + scope.#widgetRenderer.editStoreModalBody);
                widgetBodyEditController.init(container, scope.#widgetRenderer.editStoreModalBodyBtn);
                widgetBodyEditController.setModal(pageContentModal);

                modalElement?.addEventListener('hidden.bs.modal', function (event) {
                    widgetBodyEditController.destroy();
                });
            });
        }


        if (this.#widgetModel.analyticsEnabled) {
            let widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticBtn, function(){
                widgetBodyController.buildCriteria()
            });

            widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticCleanAllBtn, function(){
                widgetBodyController.analyticCleanAll()
            });
        }

        eventBus.on('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    #toggleBtnGroupListener = (viewType) => {
        const scope = this;
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.add2ВChildNodes, viewType === 'viewer-2d');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.editSaveBtn, viewType === 'editMode');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewEventsChartsBtnId, viewType === 'chart');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewDataChartsBtnId, viewType === 'chart');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewMapActionsBtnId, viewType === 'map');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewModelActionsBtnId,  (viewType === 'viewer-3d' || viewType === 'viewer-2d'));
    };

    destroy(){
        const scope = this;
        scope.#widgetBodyControllers.forEach(function (controller) {
            controller.destroy();
        });

        scope.#widgetActionsControllers.forEach(function (controller) {
            controller.destroy();
        });

        scope.#widgetRenderer.destroy();
        eventBus.removeListener('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    // #initEventRepos(activeNode) {
    //     let repoEventsList;
    //     if(activeNode.properties.availableRepos){
    //         repoEventsList = [];
    //         activeNode.properties.availableRepos.forEach(function (repo) {
    //             repoEventsList.push({
    //                 id: repo.repoId,
    //                 name: repo.repoName,
    //                 event : repo.repoId
    //             })
    //         })
    //     }
    //     return repoEventsList;
    // }

    // #initDataList(activeNode) {
    //     let repoDataList;
    //     if(activeNode.properties.availableDataRepos){
    //         repoDataList = [];
    //         activeNode.properties.availableDataRepos.forEach(function (repo) {
    //             repoDataList.push({
    //                 id: repo.repoId,
    //                 name: repo.repoName,
    //                 event : repo.repoId
    //             })
    //         })
    //     }
    //     return repoDataList;
    // }
}