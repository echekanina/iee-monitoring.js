export default class IeecloudWidgetBtnActionController {
    #widgetBodyController;

    constructor(widgetBodyController) {
        this.#widgetBodyController = widgetBodyController;
    }

    init(btnId, actionFunction) {
        const fullScreen = document.getElementById(btnId);
        fullScreen?.addEventListener('click', function(event){
            actionFunction();
        });
    }
}