import IeecloudPageContent from "./page-content/module-content/IeecloudPageContent.js";

export default class IeecloudContent {
    #layoutModel;
    #observableObject;
    #template = ``;

    set layoutModel(layoutModel) {
        this.#layoutModel = layoutModel;
    }

    set observableObject(observableObject) {
        this.#observableObject = observableObject;
    }

    constructor(layoutModel, observableObject) {
        this.#layoutModel = layoutModel;
        this.#observableObject = observableObject;
    }

    generateTemplate() {
        this.#template = ` <div id="content">  </div>`;
        return this.#template;
    }


    insertTemplates() {
        this.pageContent = new IeecloudPageContent(this.#layoutModel.pageContent, this.#observableObject);
        const pageContentTemplate = this.pageContent.generateTemplate();
        const containerElement = document.querySelector("#content");
        containerElement.insertAdjacentHTML('afterbegin', pageContentTemplate);
        this.pageContent.insertTemplates();
    }
}