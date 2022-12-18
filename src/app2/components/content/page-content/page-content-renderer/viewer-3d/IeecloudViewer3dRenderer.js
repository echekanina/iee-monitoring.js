import './styles/viewer-monitoring.scss';
import vertexMap from './mock/vertexMap.json'
import {eventBus} from "../../../../../main/index.js";

export default class IeecloudViewer3dRenderer {
    #params;
    observableObject;
    #node;
    #renderModel;

    constructor(node, params) {
        this.#node = node;
        this.#params = params;
        this.addEventListeners();

        this.#renderModel = this.#node.properties.viewerModel;

        if(this.#params){
            const modelUrl = this.#renderModel.replace(".zip", this.#params + ".zip")
            this.#renderModel = modelUrl;
        }
    }

    generateTemplate() {
        return `<div class="viewer-area">
                                       <iframe type="text/html" src="./viewer-frame/viewer-wrapper.html?model=` +  this.#renderModel + `" width="100%" height="550" >
                                       </div>
                                    `;
    }

    render(container) {
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', this.generateTemplate());
    }


    onShapeClicked = (groupId) => {
        const data = {groupId : groupId, activeNode: this.#node}
        setTimeout(function (){
            eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
        }, 200)

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