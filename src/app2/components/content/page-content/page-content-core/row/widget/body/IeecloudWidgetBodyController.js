import IeecloudWidgetBodyRenderer
    from "../../../../page-content-renderer/row/widget/body/IeecloudWidgetBodyRenderer.js";
import {eventBus} from "../../../../../../../main/index.js";
import IeecloudTableController from "../../../view/table/IeecloudTableController.js";
import IeecloudViewer2dRendererController from "../../../view/viewer-2d/IeecloudViewer2dRendererController.js";
import IeecloudViewer3dController from "../../../view/viewer-3d/IeecloudViewer3dController.js";
import IeecloudMapRendererController from "../../../view/map/IeecloudMapRendererController.js";
import IeecloudChartPairController from "../../../view/chart-pair/IeecloudChartPairController.js";
import IeecloudWidgetEditBodyController from "../../../view/edit/IeecloudWidgetBodyEditController.js";
import IeecloudDummyController from "../../../view/dummy/IeecloudDummyController.js";
import IeecloudEditTreeController from "../../../view/tree-edit/IeecloudEditTreeController.js";
import IeecloudChartOneController from "../../../view/chart-new/IeecloudChartOneController.js";
import IeecloudDocsController from "../../../view/docs/IeecloudDocsController.js";
import IeecloudAlbumController from "../../../view/album/IeecloudAlbumController.js";

export default class IeecloudWidgetBodyController {
    #widgetContentModel;
    #systemController;
    #widgetBodyRenderer;
    #viewController;

    #viewType;
    #modelData;
    #mapType;
    #storeType; // Array
    #tooltipIndicator;
    #tooltipTypeIndicator;
    #tooltipFuncAggregation;

    constructor(widgetContent, systemController) {
        this.#widgetContentModel = widgetContent;
        this.#systemController = systemController;
    }

    init(containerId, widgetModel, prevUserSettings) {
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

        this.#viewType = (activeNode.properties.defaultView && activeNode.properties.defaultView !== '') ?
            activeNode.properties.defaultView : this.#widgetContentModel.view;
        this.#modelData = this.#widgetContentModel.model;
        this.#mapType = this.#widgetContentModel.map;
        this.#tooltipIndicator = this.#widgetContentModel.indicator;
        this.#tooltipTypeIndicator = this.#widgetContentModel.indicatorType;
        this.#tooltipFuncAggregation = this.#widgetContentModel.funcAggregation;

        if (widgetModel.availableRepos) {
            if(prevUserSettings?.userDataStoreTypes){
                const names = prevUserSettings?.userDataStoreTypes.map(function(element) {
                    return element['name'];
                });
                this.#storeType = widgetModel.availableRepos[nodeProps.type]?.filter((item) => names.includes(item.name));
            }else{
                this.#storeType = widgetModel.availableRepos[nodeProps.type]?.filter((item) => item.show === true);
            }
        }

        this.#widgetBodyRenderer = new IeecloudWidgetBodyRenderer(containerId, this.#widgetContentModel, activeNode);

        this.#widgetBodyRenderer.render();
        this.#initView();
    }

    #initView() {
        this.destroy();


        switch (this.#viewType) {
            case "table":
                this.#viewController = new IeecloudTableController(this.#widgetContentModel, this.#systemController, this.#widgetContentModel.tableMode);
                break
            case "viewer-2d":
                this.#viewController = new IeecloudViewer2dRendererController(this.#modelData, this.#systemController, this.#tooltipIndicator, this.#tooltipTypeIndicator, this.#tooltipFuncAggregation);
                break
            case "viewer-3d":
                this.#viewController = new IeecloudViewer3dController(this.#modelData, this.#systemController);
                break
            case "map":
                this.#viewController = new IeecloudMapRendererController(this.#mapType, this.#systemController);
                break
            case "chart":
                this.#viewController = new IeecloudChartPairController(this.#storeType, this.#systemController);
                break
            case "analytics":
                this.#viewController = new IeecloudChartOneController(this.#storeType, this.#systemController);
                break
            case "editMode":
                this.#viewController = new IeecloudWidgetEditBodyController(this.#systemController, 'EDIT', this);
                break
            case "treeEdit":
                this.#viewController = new IeecloudEditTreeController(this.#systemController);
                break
            case "docs":
                this.#viewController = new IeecloudDocsController(this.#systemController);
                break
            case "album":
                this.#viewController = new IeecloudAlbumController(this.#systemController);
                break
            default:
                this.#viewController = new IeecloudDummyController(this.#systemController);
        }
        const bodyContainerElement = document.querySelector("#widget-body-" + this.#widgetContentModel.id);
        this.#viewController.init(bodyContainerElement);
    }

    destroy() {
        let scope = this;
        scope.#widgetBodyRenderer.destroy();
        scope.#viewController?.destroy();
        scope.#viewController = null;
    }

    fullScreen() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.fullScreen) {
            scope.#viewController.fullScreen();
        }
    }

    downloadDocument(){
        const scope = this;
        if (scope.#viewController && scope.#viewController.downloadDocument) {
            scope.#viewController.downloadDocument();
        }
    }

    buildCriteria() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.buildCriteria) {
            scope.#viewController.buildCriteria();
        }
    }

    addNewAnalysis() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.addNewAnalysis) {
            scope.#viewController.addNewAnalysis();
        }
    }

    screenshot() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.screenshot) {
            scope.#viewController.screenshot();
        }
    }


    analyticCleanAll() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.analyticCleanAll) {
            scope.#viewController.analyticCleanAll();
        }
    }

    toggleAddChildNodes(flag, containers) {
        const scope = this;
        if (scope.#viewController && scope.#viewController.toggleAddChildNodes) {
            scope.#viewController.toggleAddChildNodes(flag, containers);
        }
    }

    saveEditedData() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.saveEditedData) {
            scope.#viewController.saveEditedData();
        }
    }

    createNewTree(){
        const scope = this;
        if (scope.#viewController && scope.#viewController.createNewTree) {
            scope.#viewController.createNewTree();
        }
    }

    applyDateRange(startDateParam, endDateParam){
        const scope = this;
        if (scope.#viewController && scope.#viewController.applyDateRange) {
            scope.#viewController.applyDateRange(startDateParam, endDateParam);
        }
    }

    setDefaultDateRange(startDateParam, endDateParam){
        const scope = this;
        if (scope.#viewController && scope.#viewController.applyDateRange) {
            scope.#viewController.setDefaultDateRange(startDateParam, endDateParam);
        }
    }

    switchView(view, modelData, mapType, eventValue, indicator, indicatorType, funcAggregation, list) {
        if (view && view !== this.#viewType) {
            this.#viewType = view;
            this.#initView();
            eventBus.emit('IeecloudWidgetActionsController.viewChanged', view, false);
            return;
        }

        if (modelData && modelData !== this.#modelData) {
            this.#modelData = modelData;
            this.#initView();
            return;
        }

        if (mapType && mapType !== this.#mapType && this.#viewType === 'map') {
            this.#mapType = mapType;
            this.#changeViewType('map', mapType);
            return;
        }

        if (indicator && indicator !== this.#tooltipIndicator && this.#viewType === 'viewer-2d') {
            this.#tooltipIndicator = indicator;
            eventBus.emit('IeecloudWidgetBodyController.startIndicatorChanged');
            this.#changeIndicator(this.#tooltipIndicator, this.#tooltipTypeIndicator, this.#tooltipFuncAggregation, list, 'indicator', this.#viewType);
            return;
        }

        if (indicatorType && indicatorType !== this.#tooltipTypeIndicator && this.#viewType === 'viewer-2d') {
            this.#tooltipTypeIndicator = indicatorType;
            eventBus.emit('IeecloudWidgetBodyController.startTypeIndicatorChanged');
            this.#changeIndicator(this.#tooltipIndicator, this.#tooltipTypeIndicator, this.#tooltipFuncAggregation, list, 'indicatorType', this.#viewType);
            return;
        }

        if (funcAggregation && funcAggregation !== this.#tooltipFuncAggregation && this.#viewType === 'viewer-2d') {
            this.#tooltipFuncAggregation = funcAggregation;
            eventBus.emit('IeecloudWidgetBodyController.startFuncAggregationChanged');
            this.#changeIndicator(this.#tooltipIndicator, this.#tooltipTypeIndicator, this.#tooltipFuncAggregation, list, 'funcAggregation', this.#viewType);
            return;
        }



        if (eventValue?.item.store) {

            if (!eventValue.isChecked) {
                this.#clearStore(eventValue.item);
                return;
            }

            if (eventValue.isChecked) {
                this.#loadStore(this.#viewType, eventValue.item);
            }
        }
    }


    #changeViewType(viewType, value) {
        const scope = this;
        if (scope.#viewController && scope.#viewType === viewType) {
            if (scope.#viewController.changeViewType) {
                if (scope.#viewType === 'map') {
                    scope.#mapType = value;
                }
                scope.#viewController.changeViewType(value);
            }
        }
    }

    #changeIndicator(indicator, tooltipTypeIndicator, tooltipFuncAggregation, list, indicatorName, viewType) {
        const scope = this;
        if (scope.#viewController && scope.#viewType === viewType) {
            if (scope.#viewController.changeIndicator) {
                scope.#viewController.changeIndicator(indicator,  tooltipTypeIndicator, tooltipFuncAggregation, list, indicatorName);
            }
        }
    }

    #loadStore(viewType, itemStore) {
        const scope = this;
        if (scope.#viewController && this.#viewType === viewType) {
            if (scope.#viewController.loadStore) {
                this.#storeType = itemStore.store;
                scope.#viewController.loadStore(itemStore);
            }
        }
    }

    #clearStore(itemStore) {
        const scope = this;
        if (scope.#viewController.clearStore) {
            scope.#viewController.clearStore(itemStore);
        }
    }

    getAllowedUserWidgetSettings(){
        if (this.#viewType === 'chart' || this.#viewType === 'analytics') {
            return this.#viewController.defaultStoreTypes;
        }
        return null;
    }

    get viewType() {
        return this.#viewType;
    }

    get modelData() {
        return this.#modelData;
    }

    get mapType() {
        return this.#mapType;
    }

    get storeType() {
        return this.#storeType;
    }

    get tooltipIndicator() {
        return this.#tooltipIndicator;
    }

    get tooltipTypeIndicator() {
        return this.#tooltipTypeIndicator;
    }

    get tooltipFuncAggregation() {
        return this.#tooltipFuncAggregation;
    }
}