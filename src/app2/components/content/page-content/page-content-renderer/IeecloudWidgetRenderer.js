import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import IeecloudWidgetActionsRenderer from "./IeecloudWidgetActionsRenderer.js";

export default class IeecloudWidgetRenderer {
    #layoutModel;
    #node;

    constructor(layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
    }


    generateTemplate() {
        return `<div class="` + this.#layoutModel.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 text-primary">` + this.#layoutModel.name + `</h6>
                             
                                        <div class="dropdown no-arrow">
     
        
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-bs-toggle="dropdown" aria-haspopup="true"  aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" aria-labelledby="dropdownMenuLink"
         id="dropDownContainer-` + this.#layoutModel.id + `">
           
        </ul>
    </div>
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.#layoutModel.id + `">
                                </div>
                            </div>
                        </div>`;
    }

    render(container){
        let widgetTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', widgetTemplate);
        let widgetBody;
        if (this.#layoutModel.widgetContent) {
            const bodyContainerElement = document.querySelector("#card-body-container-" + this.#layoutModel.id);
            widgetBody = new IeecloudWidgetBodyRenderer(this.#layoutModel.widgetContent, this.#node, bodyContainerElement);
            widgetBody.render();
        }

        if (this.#layoutModel.dropDownActions) {
            const widgetBodyId = this.#layoutModel.widgetContent.id;
            const dropDownContainerElement = document.querySelector("#dropDownContainer-" + this.#layoutModel.id);
            const widgetHeaderActions = new IeecloudWidgetActionsRenderer(widgetBody, this.#layoutModel.dropDownActions);
            widgetHeaderActions.render(dropDownContainerElement);
        }
    }
}