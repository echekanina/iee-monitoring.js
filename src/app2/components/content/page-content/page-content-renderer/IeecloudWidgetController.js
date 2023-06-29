import IeecloudWidgetRenderer from "./IeecloudWidgetRenderer.js";
import IeecloudWidgetBodyController from "./IeecloudWidgetBodyController.js";
import IeecloudWidgetActionsController from "./IeecloudWidgetActionsController.js";
import {eventBus} from "../../../../main/index.js";
import IeecloudWidgetBtnActionController from "./IeecloudWidgetBtnActionController.js";
import IeecloudWidgetMultiActionsController from "./IeecloudWidgetMultiActionsController.js";
import {Modal} from "bootstrap";
import IeecloudWidgetEditBodyController from "./IeecloudWidgetBodyEditController.js";

export default class IeecloudWidgetController {
    #widgetModel;
    #systemController;
    #widgetBodyControllers = [];
    #widgetRenderer;

    constructor(widgetModel, systemController) {
        this.#widgetModel = widgetModel;
        this.#systemController = systemController;

    }

    init(containerId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const eventsRepoList = scope.#initEventRepos(activeNode);
        scope.#widgetRenderer = new IeecloudWidgetRenderer(containerId, this.#widgetModel, activeNode, eventsRepoList);
        scope.#widgetRenderer.render();

        let widgetBodyController;
        if (this.#widgetModel.widgetContent) {
            widgetBodyController = new IeecloudWidgetBodyController(this.#widgetModel.widgetContent, this.#systemController);
            widgetBodyController.init(scope.#widgetRenderer.cardBodyContainer);
            scope.#widgetBodyControllers.push(widgetBodyController);
        }

        if (this.#widgetModel.viewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.viewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewActionsContainer);
        }

        if (this.#widgetModel.modelDataActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.modelDataActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.modelDataActionsContainer);
        }

        if (this.#widgetModel.mapViewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.mapViewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewMapActionsContainer);
        }

        if (eventsRepoList) {
            const widgetHeaderActionsController = new IeecloudWidgetMultiActionsController(widgetBodyController, eventsRepoList);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewEventsStoresContainer);
        }

        if (this.#widgetModel.fullScreenEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.fullScreenBtn, function(){
                widgetBodyController.fullScreen();
            });
        }
        if (this.#widgetModel.editEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.editStoreBtn, function(){
                const modalElement = document.getElementById(scope.#widgetRenderer.editStoreModal);


                const widgetBodyEditController = new IeecloudWidgetEditBodyController(widgetBodyController,
                    scope.#systemController);

                widgetBodyEditController.init(scope.#widgetRenderer.editStoreModalBody);



                let pageContentModal = new Modal(modalElement);
                pageContentModal.show();
            });
        }

        eventBus.on('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    #toggleBtnGroupListener = (viewType) => {
        const scope = this;
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewMapActionsBtnId, viewType === 'map');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewModelActionsBtnId,  (viewType === 'viewer-3d' || viewType === 'viewer-2d'));
    };

    destroy(){
        const scope = this;
        scope.#widgetBodyControllers.forEach(function (controller) {
            controller.destroy();
        });

        scope.#widgetRenderer.destroy();
        eventBus.removeListener('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    #initEventRepos(activeNode) {
        const scope = this;
        let repoEventsList;
        if(activeNode.properties.availableRepos){
            repoEventsList = [];
            activeNode.properties.availableRepos.forEach(function (repo) {
                repoEventsList.push({
                    id: repo.repoId,
                    name: repo.repoName,
                    event : repo.repoId
                })
            })
        }
        return repoEventsList;
    }
}