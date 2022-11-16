import IeecloudTable from "./widget-body/table/IeecloudTable.js";
import IeecloudViewer2d from "./widget-body/viewer-2d/IeecloudViewer2d.js";
import IeecloudDummy from "./widget-body/dummy/IeecloudDummy.js";
import IeecloudViewer3d from "./widget-body/viewer-3d/IeecloudViewer3d.js";

export default class IeecloudWidgetBody {
    layoutModel;
    observableObject;
    #template = ``;

    constructor(layoutModel, observableObject) {
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
        this.addEventListeners();

    }

    addEventListeners() {
        const scope = this;
        this.observableObject.on('IeecloudWidgetActions.click', function (data) {
            console.log(data);
            if (data.bodyId !== scope.layoutModel.id) {
                return;
            }
            scope.destroyContent();
            scope.insertTemplates(data.type, data.params);
        });
    }

    generateTemplate() {
        this.#template = ` <div class="widget-body-content" id="widget-body-` + this.layoutModel.id + `">
                                    </div>`;
        return this.#template;
    }

    insertTemplates(viewType, params) {

        let view;

        switch (viewType) {
            case "table":
                view = new IeecloudTable(this.layoutModel, this.observableObject);
                break
            case "viewer-2d":
                view = new IeecloudViewer2d(this.layoutModel);
                break
            case "viewer-3d":
                view = new IeecloudViewer3d(this.layoutModel, this.observableObject, params);
                break

            default:
                view = new IeecloudDummy(this.layoutModel);
        }
        const viewTemplate = view.generateTemplate();
        const bodyContainerElement = document.querySelector("#widget-body-" + this.layoutModel.id);
        bodyContainerElement.insertAdjacentHTML('beforeend', viewTemplate);
        view.insertTemplates();
    }

    destroyContent() {
        const bodyContainerElement = document.querySelector("#widget-body-" + this.layoutModel.id);
        const childNodes = bodyContainerElement.childNodes;
        let i = childNodes.length;
        while (i--) {
            bodyContainerElement.removeChild(childNodes[i]);
        }
    }
}