import EventDispatcher from "../../../../../main/events/EventDispatcher.js";
import IeecloudWidgetActionsRenderer from "../../page-content-renderer/actions/IeecloudWidgetActionsRenderer.js";
import {isArray} from "lodash-es";
import IeecloudWidgetActionsService from "./IeecloudWidgetActionsService.js";

export default class IeecloudWidgetActionsController extends EventDispatcher{
    #widgetBodyController;
    #actionList;
    #systemController;

    constructor(systemController, widgetBodyController, actionSource, field) {
        super();
        this.#systemController = systemController;
        this.#widgetBodyController = widgetBodyController;
        if(isArray(actionSource)){
            this.#actionList = actionSource;
        } else{
            const repoId  = actionSource.repoId;
            const scope = this;
            const service = new IeecloudWidgetActionsService();
            service.readScheme(repoId, function (result) {
                service.readData(repoId, result, field, function (data) {
                    scope.#actionList = data;
                    scope.dispatchEvent({type: 'IeecloudWidgetActionsController.actionDataRecieved', value: data});
                });
            });
        }
        
    }

    init(containerId) {
        let scope = this;

        this.#updateActionListState();

        let activeNode = this.#systemController.getActiveNode();

        const ieecloudWidgetActionsRenderer = new IeecloudWidgetActionsRenderer(containerId, this.#actionList, activeNode);
        ieecloudWidgetActionsRenderer.render();

        ieecloudWidgetActionsRenderer.addEventListener('IeecloudWidgetActionsRenderer.selectItem', function (event) {
            const item = event.value;
            scope.#widgetBodyController.switchView(item.view, item.model, item.map, item.event, item.indicator,
                item.typeIndicator, item.funcAggregation
            );
            scope.#updateActionListState();
            ieecloudWidgetActionsRenderer.layoutModel = scope.#actionList;
            ieecloudWidgetActionsRenderer.redraw();
        });
    }

    #updateActionListState() {
        let scope = this;
        this.#actionList.forEach(function (item) {

            if (item.hasOwnProperty('model')) {
                item.active = item.model === scope.#widgetBodyController?.modelData;
            }

            if (item.hasOwnProperty('view')) {
                item.active = item.view === scope.#widgetBodyController?.viewType;
            }

            if (item.hasOwnProperty('map')) {
                item.active = item.map === scope.#widgetBodyController?.mapType;
            }

            if (item.hasOwnProperty('indicator')) {
                item.active = item.indicator === scope.#widgetBodyController?.tooltipIndicator;
            }

            if (item.hasOwnProperty('typeIndicator')) {
                item.active = item.typeIndicator === scope.#widgetBodyController?.tooltipTypeIndicator;
            }

            if (item.hasOwnProperty('funcAggregation')) {
                item.active = item.funcAggregation === scope.#widgetBodyController?.tooltipFuncAggregation;
            }
        });
    }
}