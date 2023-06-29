export default class IeecloudWidgetBtnActionController {
    #widgetBodyController;

    constructor(widgetBodyController) {
        this.#widgetBodyController = widgetBodyController;
    }

    init(btnId, actionFunction) {
        const scope = this;
        const fullScreen = document.querySelector("#" + btnId);
        fullScreen?.addEventListener('click', function(event){
            // scope.#widgetBodyController.fullScreen();
            actionFunction();
            // scope.#executeFunctionByName(actionFunctionName, window)
        });
    }
}