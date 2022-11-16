import './styles/viewer-monitoring.scss';

import vertexMap from './mock/vertexMap.json'

export default class IeecloudViewer3d {
    model;
    #template;
    #params;
    observableObject;

    constructor(model, observableObject, params) {
        this.model = model;
        this.observableObject = observableObject;
        this.#params = params;
        this.addEventListeners();
    }

    generateTemplate() {
        this.#template = `<div class="viewer-area">
                                       <iframe type="text/html" src="./resources/viewer-frame/viewer-wrapper.html?model=` + this.#params.url + `" width="100%" height="500" >
                                       </div>
                                    `;
        return this.#template;
    }

    insertTemplates() {
    }

    onShapeClicked = (groupId) => {
        this.observableObject.emit('IeecloudTable.rowClick', groupId, false);
    }


    receiveMessage = (event) => {
        const message = event.data.message;

        switch (message) {
            case 'getAppData':
                if (vertexMap[event.data.value]) {
                    this.onShapeClicked(vertexMap[event.data.value]);
                }
                break;
        }
    }

    addEventListeners() {
        window.addEventListener("message", this.receiveMessage, false);
    }
}