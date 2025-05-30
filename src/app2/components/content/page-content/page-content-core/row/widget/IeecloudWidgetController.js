import IeecloudWidgetRenderer from "../../../page-content-renderer/row/widget/IeecloudWidgetRenderer.js";
import IeecloudWidgetBodyController from "./body/IeecloudWidgetBodyController.js";
import IeecloudWidgetActionsController from "../../actions/IeecloudWidgetActionsController.js";
import {eventBus} from "../../../../../../main/index.js";
import IeecloudWidgetBtnActionController from "../../actions/IeecloudWidgetBtnActionController.js";
import IeecloudWidgetMultiActionsController from "../../actions/IeecloudWidgetMultiActionsController.js";
import {Modal} from "bootstrap";
import IeecloudWidgetEditBodyController from "../../view/edit/IeecloudWidgetBodyEditController.js";
import IeecloudWidgetDateRangeController from "../../actions/IeecloudWidgetDateRangeController.js";

export default class IeecloudWidgetController {
    #widgetModel;
    #systemController;
    #widgetBodyControllers = [];
    #widgetRenderer;
    #widgetActionsControllers = [];
    #widgetHeaderDateRangeController;
    #widgetHeaderActionsController;
    #widgetBodyController;

    constructor(widgetModel, systemController) {
        this.#widgetModel = widgetModel;
        this.#systemController = systemController;

    }

    init(containerId, prevUserSettings) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#widgetRenderer = new IeecloudWidgetRenderer(containerId, this.#widgetModel, activeNode);
        scope.#widgetRenderer.render();

        if (this.#widgetModel.widgetContent) {
            scope.#widgetBodyController = new IeecloudWidgetBodyController(this.#widgetModel.widgetContent, this.#systemController);
            scope.#widgetBodyController.init(scope.#widgetRenderer.cardBodyContainer,this.#widgetModel, prevUserSettings);
            scope.#widgetBodyControllers.push(scope.#widgetBodyController);
        }

        if (this.#widgetModel.viewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.viewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewActionsContainer);
        }

        if (this.#widgetModel.modelDataActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.modelDataActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.modelDataActionsContainer);
        }

        if (this.#widgetModel.mapViewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.mapViewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewMapActionsContainer);
        }

        if (this.#widgetModel.tooltipIndicators) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.tooltipIndicators, 'indicator');
            widgetHeaderActionsController.addEventListener('IeecloudWidgetActionsController.actionDataRecieved', function (event) {
                const items = event.value;
                widgetHeaderActionsController.init(scope.#widgetRenderer.tooltipIndicatorsActionsContainer);
                const item = items.find(item => item.indicator === scope.#widgetModel.widgetContent.indicator)
                scope.#widgetRenderer.changeBtnDropDownText(scope.#widgetRenderer.dropdownTooltipIndicatorsTextId, item.name);
            });
        }

        if (this.#widgetModel.tooltipTypeIndicators) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.tooltipTypeIndicators, 'typeIndicator');
            widgetHeaderActionsController.addEventListener('IeecloudWidgetActionsController.actionDataRecieved', function (event) {
                const items = event.value;
                widgetHeaderActionsController.init(scope.#widgetRenderer.tooltipTypeIndicatorsActionsContainer);
                const item = items.find(item => item.typeIndicator === scope.#widgetModel.widgetContent.indicatorType)
                scope.#widgetRenderer.changeBtnDropDownText(scope.#widgetRenderer.dropdowntooltipTypeIndicatorsText, item.name);
            });

        }

        if (this.#widgetModel.tooltipFuncAggregation) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(this.#systemController, scope.#widgetBodyController, this.#widgetModel.tooltipFuncAggregation);
            widgetHeaderActionsController.init(scope.#widgetRenderer.tooltipFuncAggregationActionsContainer);
            const item = this.#widgetModel.tooltipFuncAggregation.find(item => item.funcAggregation === scope.#widgetModel.widgetContent.funcAggregation);
            scope.#widgetRenderer.changeBtnDropDownText(scope.#widgetRenderer.dropDownContainerTooltipFuncAggregationText, item.name);
        }

        if (this.#widgetModel.availableRepos && this.#widgetModel.availableRepos[nodeProps.type]) {
            scope.#widgetHeaderActionsController = new IeecloudWidgetMultiActionsController(scope.#widgetBodyController, this.#widgetModel.availableRepos[nodeProps.type]);
            scope.#widgetHeaderActionsController.init(scope.#widgetRenderer.viewEventsStoresContainer);
            scope.#widgetActionsControllers.push(scope.#widgetHeaderActionsController);
        }

        if (this.#widgetModel.fullScreenEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.fullScreenBtn, function(){
                scope.#widgetBodyController.fullScreen();
            });
        }

        if (this.#widgetModel.widgetContent.view === 'docs') {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.downloadDocBtn, function(){
                scope.#widgetBodyController.downloadDocument();
            });
        }

        if (this.#widgetModel.add2DNodesEnabled) {
            const widgetHeaderTurnAddModeBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderTurnAddModeBtnActionController.init(scope.#widgetRenderer.add2ВChildNodes, function(){
                scope.#widgetRenderer.add2DMode = !scope.#widgetRenderer.add2DMode;
                const title = scope.#widgetRenderer.add2DMode ? scope.#widgetModel.add2DNodesEnabledTurnOffTitle : scope.#widgetModel.add2DNodesEnabledTurnTitle
                scope.#widgetRenderer.toggleTurnBtnLink(scope.#widgetRenderer.add2ВChildNodes, title,  scope.#widgetRenderer.add2DMode);
                scope.#widgetBodyController.toggleAddChildNodes(scope.#widgetRenderer.add2DMode, scope.#widgetRenderer.edit2dNodesContainers);
            });
        }


        if (this.#widgetModel.editEnabled) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.editSaveBtn, function(){
                scope.#widgetBodyController.saveEditedData();
            });
        }

        if (this.#widgetModel.editEnabled  && activeNode.properties.editTreeMode) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.addNewTreeBtn, function(){
                scope.#widgetBodyController.createNewTree();
            });
        }

        if (this.#widgetModel.editEnabled && activeNode.properties.editMode) {
            const widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
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
            let widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticPlusBtn, function(){
                scope.#widgetBodyController.addNewAnalysis()
            });

            widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticBtn, function(){
                scope.#widgetBodyController.buildCriteria()
            });

            widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticCleanAllBtn, function(){
                scope.#widgetBodyController.analyticCleanAll()
            });

            widgetHeaderBtnActionController = new IeecloudWidgetBtnActionController(scope.#widgetBodyController);
            widgetHeaderBtnActionController.init(scope.#widgetRenderer.analyticScreenBtn, function(){
                scope.#widgetBodyController.screenshot();
            });
        }

        if (this.#widgetModel.dateTimeRangeEnabled) {
            scope.#widgetHeaderDateRangeController = new IeecloudWidgetDateRangeController(scope.#widgetBodyController);
            if (prevUserSettings) {
                scope.#widgetHeaderDateRangeController.init(scope.#widgetRenderer.dateRangeInput, prevUserSettings);
            } else {
                scope.#widgetHeaderDateRangeController.init(scope.#widgetRenderer.dateRangeInput);
            }


            scope.#widgetActionsControllers.push(scope.#widgetHeaderDateRangeController);
        }

        eventBus.on('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);

        eventBus.on( 'IeecloudWidgetBodyController.startIndicatorChanged',  function () {
          
                    const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipIndicatorsLinkInner);
                    const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipIndicatorsLinkSpinner);
                    dropDownPlaceHolder.classList.add('invisible');
                    dropDownPlaceSpinner.classList.remove('d-none');

                });

                eventBus.on( 'IeecloudWidgetBodyController.startTypeIndicatorChanged',  function () {
          
                    const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipTypeIndicatorsLinkInner);
                    const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipTypeIndicatorsLinkSpinner);
                    dropDownPlaceHolder.classList.add('invisible');
                    dropDownPlaceSpinner.classList.remove('d-none');

                });

                eventBus.on( 'IeecloudWidgetBodyController.startFuncAggregationChanged',  function () {
          
                    const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipFuncAggregationLinkInner);
            const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipFuncAggregationLinkSpinner);
            dropDownPlaceHolder.classList.add('invisible');
            dropDownPlaceSpinner.classList.remove('d-none');

                });



        eventBus.on('IeecloudViewer2dRendererController.indicatorChanged', function (data) {
          
            const item = data.list?.find(item => item.indicator === data.value)
            scope.#changeBtnDropDownText(scope.#widgetRenderer.dropdownTooltipIndicatorsTextId, item?.name)
                   

                    const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipIndicatorsLinkInner);
                    const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipIndicatorsLinkSpinner);
                    dropDownPlaceHolder.classList.remove('invisible');
                    dropDownPlaceSpinner.classList.add('d-none');
                });



        eventBus.on('IeecloudViewer2dRendererController.indicatorTypeChanged',  function (data) {
            const item = data.list?.find(item => item.typeIndicator === data.value)
            scope.#changeBtnDropDownText(scope.#widgetRenderer.dropdowntooltipTypeIndicatorsText, item?.name);
            const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipTypeIndicatorsLinkInner);
                    const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipTypeIndicatorsLinkSpinner);
                    dropDownPlaceHolder.classList.remove('invisible');
                    dropDownPlaceSpinner.classList.add('d-none');
                    });


        eventBus.on('IeecloudViewer2dRendererController.funcAggregationChanged', function (data) {
            
            const item = data.list?.find(item => item.funcAggregation === data.value)
            scope.#changeBtnDropDownText(scope.#widgetRenderer.dropDownContainerTooltipFuncAggregationText, item?.name);

            const dropDownPlaceHolder = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipFuncAggregationLinkInner);
            const dropDownPlaceSpinner = document.querySelector("#" + scope.#widgetRenderer.dropdowntooltipFuncAggregationLinkSpinner);
            dropDownPlaceHolder.classList.remove('invisible');
            dropDownPlaceSpinner.classList.add('d-none');

                    });
    }

    #toggleBtnGroupListener = (viewType) => {
        const scope = this;
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.add2ВChildNodes, viewType === 'viewer-2d');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.editSaveBtn, viewType === 'editMode');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewEventsChartsBtnId, viewType === 'chart');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewDataChartsBtnId, viewType === 'chart');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewMapActionsBtnId, viewType === 'map');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.tooltipIndicatorsActionsBtnId, viewType === 'viewer-2d');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.tooltipTypeIndicatorsActionsBtnId, viewType === 'viewer-2d');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewModelActionsBtnId,  (viewType === 'viewer-3d' || viewType === 'viewer-2d'));
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.dateRangeWrapper,  (viewType === 'chart' || viewType === 'analytics'));
    };

    #changeBtnDropDownText = (textId, value) => {
        const scope = this;
        scope.#widgetRenderer.changeBtnDropDownText(textId, value);
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
        scope.#widgetBodyControllers = [];
        scope.#widgetActionsControllers = [];
        scope.#widgetHeaderDateRangeController = null;
        eventBus.removeListener('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    get widgetModel() {
        return this.#widgetModel
    }

    getAllowedUserWidgetSettings() {
        const scope = this;
        let result = {};
        if (scope.#widgetHeaderDateRangeController) {
            if (scope.#widgetHeaderDateRangeController.isRangeChosen()) {
                result = scope.#widgetHeaderDateRangeController.getRangeByLabel(scope.#widgetHeaderDateRangeController.getChosenLabel());
            } else {
                result = {
                    startDate: scope.#widgetHeaderDateRangeController.startDate,
                    endDate: scope.#widgetHeaderDateRangeController.endDate
                }
            }
        }

        result.userDataStoreTypes = scope.#widgetBodyController.getAllowedUserWidgetSettings();
        return result ;
    }
}