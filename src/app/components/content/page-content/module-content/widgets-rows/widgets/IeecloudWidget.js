import IeecloudWidgetBody from "./IeecloudWidgetBody.js";
import IeecloudWidgetActions from "./IeecloudWidgetActions.js";

export default class IeecloudWidget {
    layoutModel;
    observableObject;
    #template = ``;

    constructor(layoutModel, observableObject) {
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
    }


    generateTemplate() {
        this.#template = `<div class="` + this.layoutModel.clazz + `">
                            <div class="card shadow mb-4">
                                <!-- Widget Header - Dropdown -->
                                <div
                                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 text-primary">` + this.layoutModel.name + `</h6>
                             
                                        <div class="dropdown no-arrow">
     
        
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-bs-toggle="dropdown" aria-haspopup="true"  aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>

        <ul class="dropdown-menu  dropdown-menu-end shadow animated--fade-in" aria-labelledby="dropdownMenuLink"
         id="dropDownContainer-` + this.layoutModel.id + `">
           
        </ul>
    </div>
                                </div>
                                <!-- Widget Body -->
                                <div class="card-body" id="card-body-container-` + this.layoutModel.id + `">
                                </div>
                            </div>
                        </div>`;
        return this.#template;
    }

    insertTemplates() {
        let widgetBody;
        if(this.layoutModel.widgetContent){
            widgetBody = new IeecloudWidgetBody(this.layoutModel.widgetContent, this.observableObject);
            const widgetBodyTemplate = widgetBody.generateTemplate();
            const bodyContainerElement = document.querySelector("#card-body-container-"+ this.layoutModel.id);
            bodyContainerElement.insertAdjacentHTML('beforeend', widgetBodyTemplate);
            widgetBody.insertTemplates(this.layoutModel.widgetContent.type);
        }


        if(this.layoutModel.dropDownActions){
            const widgetBodyId = this.layoutModel.widgetContent.id;
            const widgetHeaderActions = new IeecloudWidgetActions(widgetBodyId, this.layoutModel.dropDownActions, this.observableObject);
            const widgetHeaderActionsTemplate = widgetHeaderActions.generateTemplate();
            const dropDownContainerElement = document.querySelector("#dropDownContainer-"+ this.layoutModel.id);
            dropDownContainerElement.insertAdjacentHTML('beforeend', widgetHeaderActionsTemplate);
            widgetHeaderActions.insertTemplates();
        }

    }
}