// TODO:dynamic import
import viewerImage from './assets/viewerImg.png'

export default class IeecloudViewer2dRenderer {
    model;
    #node;

    constructor(model, node) {
        this.#node = node;
        this.model = model;
    }

    generateTemplate() {
        return `<div class="viewer-area">
                                         <a id="viewer3d" href="#" target="_blank">
                                             <img id="viewerImg" style="width: 100%;" src="` + this.#node.properties.viewer2dModel + `" alt="">
                                         </a>
                                </div>
                                    </div>`;
    }

    render(container) {
        container.innerHTML = '';
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);
    }

}