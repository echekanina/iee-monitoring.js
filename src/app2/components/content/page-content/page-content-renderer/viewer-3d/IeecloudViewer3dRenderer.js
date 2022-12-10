import './styles/viewer-monitoring.scss';
import vertexMap from './mock/vertexMap.json'
import {eventBus} from "../../../../../main/index.js";

export default class IeecloudViewer3dRenderer {
    #params;
    observableObject;
    #node;

    constructor(node, params) {
        this.#node = node;
        this.#params = params;
        this.addEventListeners();
    }

    generateTemplate() {
        return `<div class="viewer-area">
                                       <iframe type="text/html" src="./viewer-frame/viewer-wrapper.html?model=` + this.#node.properties.viewerModel + `" width="100%" height="500" >
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