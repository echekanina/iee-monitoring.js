import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import {eventBus} from "../../../../main/index.js";

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

    switchView(view, modelData, mapType, eventValue) {
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

        if (eventValue.item.event) {

            if(!eventValue.isChecked){
                this.#widgetBodyRenderer.clearEventStore(eventValue.item.event)
                return;
            }

            if(eventValue.isChecked){
                this.#widgetBodyRenderer.loadEventStore('chart', eventValue.item);
            }
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