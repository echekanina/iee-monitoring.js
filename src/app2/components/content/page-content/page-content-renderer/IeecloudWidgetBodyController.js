import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import {eventBus} from "../../../../main/index.js";

import eventsMock from './events-mock.json'

export default class IeecloudWidgetBodyController {
    #widgetContentModel;
    #systemController;
    #widgetBodyRenderer;

    constructor(widgetContent, systemController) {
        this.#widgetContentModel = widgetContent;
        this.#systemController = systemController;
    }

    init(containerId) {
        let activeNode = this.#systemController.getActiveNode();
        this.#widgetBodyRenderer = new IeecloudWidgetBodyRenderer(containerId, this.#widgetContentModel, activeNode, this.#systemController);
        this.#widgetBodyRenderer.render();
    }

    destroy(){
        let scope = this;
        scope.#widgetBodyRenderer?.destroy();
    }

    fullScreen(){
        if (this.#widgetBodyRenderer) {
            this.#widgetBodyRenderer.fullScreen();
        }
    }

    switchView(view, modelData, mapType, storeEventType) {
        if (view && view !== this.#widgetBodyRenderer?.viewType) {
            this.#widgetBodyRenderer.viewType = view;
            this.#widgetBodyRenderer.render();
            eventBus.emit('IeecloudWidgetActionsController.viewChanged', view, false);
            return;
        }

        if (modelData && modelData !== this.#widgetBodyRenderer?.modelData) {
            this.#widgetBodyRenderer.modelData = modelData;
            this.#widgetBodyRenderer.render();
            return;
        }

        if (mapType && mapType !== this.#widgetBodyRenderer?.mapType && this.#widgetBodyRenderer?.viewType === 'map') {
            this.#widgetBodyRenderer.mapType = mapType;
            this.#widgetBodyRenderer.changeViewType('map', mapType);
            return;
        }

        if (storeEventType && storeEventType !== this.#widgetBodyRenderer?.storeEventType) {
            this.#widgetBodyRenderer.storeEventType = storeEventType;
            // console.log(eventsMock[storeEventType])

            this.#widgetBodyRenderer.loadEventStore('chart', storeEventType, eventsMock[storeEventType]);
        }
    }

    get viewType() {
        return this.#widgetBodyRenderer.viewType;
    }

    get modelData() {
        return this.#widgetBodyRenderer.modelData;
    }
    get mapType() {
        return this.#widgetBodyRenderer.mapType;
    }
    get storeEventType() {
        return this.#widgetBodyRenderer.storeEventType;
    }
}