export default class IeecloudWidgetBtnActionController {
    #widgetBodyController;

    constructor(widgetBodyController) {
        this.#widgetBodyController = widgetBodyController;
    }

    init(btnId, actionFunction) {
        const fullScreen = document.querySelector("#" + btnId);
        fullScreen?.addEventListener('click', function(event){
            actionFunction();
        });
    }
}