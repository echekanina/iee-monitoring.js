// TODO:dynamic import
import viewerImage from './assets/viewerImg.png'
export default class IeecloudViewer {
    model;
    #template
    constructor(model) {
        this.model = model;
    }

    generateTemplate(){
        this.#template = `<div class="viewer-area">
                                       <button type="button" class="btn btn-link">3D Отображение</button>
                                         <a id="viewer3d" href="#" target="_blank">
                                             <img id="viewerImg" style="width: 100%; height: 250px;" src="${viewerImage}">
                                         </a>
                                </div>
                                    </div>`;
        return this.#template;
    }

    insertTemplates() {
        console.log("IeecloudViewer")
        //Not implemented yet
    }

}