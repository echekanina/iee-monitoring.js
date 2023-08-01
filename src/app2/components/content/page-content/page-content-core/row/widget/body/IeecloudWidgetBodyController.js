import IeecloudWidgetBodyRenderer
    from "../../../../page-content-renderer/row/widget/body/IeecloudWidgetBodyRenderer.js";
import {eventBus} from "../../../../../../../main/index.js";
import IeecloudTableRenderer from "../../../../page-content-renderer/view/table/IeecloudTableRenderer.js";
import IeecloudViewer2dRenderer from "../../../../page-content-renderer/view/viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer3dRenderer from "../../../../page-content-renderer/view/viewer-3d/IeecloudViewer3dRenderer.js";
import IeecloudMapRenderer from "../../../../page-content-renderer/view/map/IeecloudMapRenderer.js";
import {
    IeecloudChartPairRenderer
} from "../../../../page-content-renderer/view/chart-pair/IeecloudChartPairRenderer.js";
import IeecloudWidgetBodyEditRenderer
    from "../../../../page-content-renderer/view/edit/IeecloudWidgetBodyEditRenderer.js";
import IeecloudDummyRenderer from "../../../../page-content-renderer/view/dummy/IeecloudDummyRenderer.js";
import IeecloudTableController from "../../../view/table/IeecloudTableController.js";
import IeecloudViewer2dRendererController from "../../../view/viewer-2d/IeecloudViewer2dRendererController.js";
import IeecloudViewer3dController from "../../../view/viewer-3d/IeecloudViewer3dController.js";
import IeecloudMapRendererController from "../../../view/map/IeecloudMapRendererController.js";
import IeecloudChartPairController from "../../../view/chart-pair/IeecloudChartPairController.js";
import IeecloudWidgetEditBodyController from "../../../view/edit/IeecloudWidgetBodyEditController.js";

export default class IeecloudWidgetBodyController {
    #widgetContentModel;
    #systemController;
    #widgetBodyRenderer;
    #viewController;

    #viewType;
    #modelData;
    #mapType;
    #storeEventType;

    constructor(widgetContent, systemController) {
        this.#widgetContentModel = widgetContent;
        this.#systemController = systemController;
    }

    init(containerId) {
        let activeNode = this.#systemController.getActiveNode();

        this.#viewType = (activeNode.properties.defaultView && activeNode.properties.defaultView !== '') ?
            activeNode.properties.defaultView : this.#widgetContentModel.view;
        this.#modelData = this.#widgetContentModel.model;
        this.#mapType = this.#widgetContentModel.map;

        this.#widgetBodyRenderer = new IeecloudWidgetBodyRenderer(containerId, this.#widgetContentModel, activeNode);

        this.#widgetBodyRenderer.render();
        this.#initView();
    }

    #initView() {
        this.destroy();

        switch (this.#viewType) {
            case "table":
                this.#viewController = new IeecloudTableController(this.#widgetContentModel, this.#systemController);
                break
            case "viewer-2d":
                this.#viewController = new IeecloudViewer2dRendererController(this.#modelData, this.#systemController);
                break
            case "viewer-3d":
                this.#viewController = new IeecloudViewer3dController(this.#modelData, this.#systemController);
                break
            case "map":
                this.#viewController = new IeecloudMapRendererController(this.#mapType, this.#systemController);
                break
            case "chart":
                this.#viewController = new IeecloudChartPairController(this.#systemController);
                break
            case "editMode":
                this.#viewController = new IeecloudWidgetEditBodyController(this.#systemController, 'EDIT');
                break
            // default:
            //     this.#viewController = new IeecloudDummyRenderer(this.#layoutModel, this.#node);
        }
        const bodyContainerElement = document.querySelector("#widget-body-" + this.#widgetContentModel.id);
        this.#viewController.init(bodyContainerElement);
    }

    destroy() {
        let scope = this;
        scope.#widgetBodyRenderer.destroy();
        scope.#viewController?.destroy()
    }

    fullScreen() {
        const scope = this;
        if (scope.#viewController && scope.#viewController.fullScreen) {
            scope.#viewController.fullScreen();
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

    switchView(view, modelData, mapType, eventValue) {
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

        if (eventValue?.item.event) {

            if (!eventValue.isChecked) {
                this.#clearEventStore(eventValue.item.event)
                return;
            }

            if (eventValue.isChecked) {
                this.#loadEventStore('chart', eventValue.item);
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

    #loadEventStore(viewType, itemStore) {
        const scope = this;
        if (scope.#viewController && this.#viewType === viewType) {
            if (scope.#viewController.loadEventStore) {
                if (this.#viewType === 'chart') {
                    this.#storeEventType = itemStore.event;
                }
                scope.#viewController.loadEventStore(itemStore);
            }
        }
    }

    #clearEventStore(storeEventType) {
        const scope = this;
        scope.#viewController.clearEventStore(storeEventType);
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

    get storeEventType() {
        return this.#storeEventType;
    }
}