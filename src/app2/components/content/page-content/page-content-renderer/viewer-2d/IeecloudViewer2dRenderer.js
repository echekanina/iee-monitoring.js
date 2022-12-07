import IeecloudViewer2dService from "./IeecloudViewer2dService";

import normImage from './assets/norm3.gif'
import emergencyImage from './assets/emergency.gif'
import warningImage from './assets/warning.gif'
import './styles/style.scss';
import {eventBus} from "../../../../../main/index.js";


export default class IeecloudViewer2dRenderer {
    model;
    #node;

    #SENSOR_WIDTH = 35
    #SENSOR_HEIGHT = 35

    constructor(model, node) {
        this.#node = node;
        this.model = model;
    }

    generateTemplate() {
        return `<div class="viewer-area">
                                         <a id="viewer2d">
                                             <img id="viewerImg" style="width: 100%;" src="` + this.#node.properties.viewer2dModel + `" alt="">
                                         </a>
                                </div>
                                    </div>`;
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);


        const imgMain = document.createElement("img");
        imgMain.onload = function (event)
        {
            console.log("natural:", imgMain.naturalWidth, imgMain.naturalHeight);
            console.log("width,height:", imgMain.width, imgMain.height);
            console.log("offsetW,offsetH:", imgMain.offsetWidth, imgMain.offsetHeight);
        }
        imgMain.src = this.#node.properties.viewer2dModel;


        const nodeProps = this.#node.properties;
        const service = new IeecloudViewer2dService(nodeProps.dataService);
        service.readScheme(nodeProps, function (result) {
            console.log(result);
            service.readData(nodeProps, result, function (data) {
                scope.#render2D(data);
            });
        });
    }

    #render2D(data) {

        const scope = this;
        const container = document.getElementById('viewer2d');
        const parentImage = document.getElementById('viewerImg');
        data.forEach(function (item) {
            console.log(item)
            if (item.coordsData?.coords?.x && item.coordsData?.coords?.y) {
                let srcImg = scope.#findIcon(item.state);
                const newImage = scope.#createImgElement(srcImg, "sensor-" + item.id, 'overlays');
                newImage.setAttribute('src', srcImg);
                newImage.setAttribute('class', 'overlays');
                let left = item.coordsData.coords.x * (parentImage.width / parentImage.naturalWidth) - (scope.#SENSOR_WIDTH / 2);
                let top = item.coordsData.coords.y * (parentImage.width / parentImage.naturalWidth) - (scope.#SENSOR_HEIGHT / 2);
                newImage.style.left = left + "px";
                newImage.style.top = top + "px";
                container.appendChild(newImage);

                newImage?.addEventListener('click', function (event) {
                    // scope.#buildPageContent(node);
                    console.log(item, "CLICK")

                    const data = {groupId: item.groupId, activeNode: scope.#node}
                    eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
                });
            }
        });
    }

    #createImgElement(src, id, clazz) {
        const scope = this;
        let element = document.createElement('img');
        if (id) {
            element.id = id;
        }

        if (clazz) {
            element.className = clazz;
        }

        if (src) {
            element.src = src;
        }

        element.setAttribute("width", scope.#SENSOR_WIDTH + "px");
        element.setAttribute("height", scope.#SENSOR_HEIGHT + "px");

        return element;
    }

    #findIcon(state) {

        console.log(state)

        let iconObj;

        switch (state) {
            case 'norm': {
                iconObj = normImage;
                break;
            }
            case 'emergency': {
                iconObj = emergencyImage;
                break;
            }
            case 'warn': {
                iconObj = warningImage;
                break;
            }
            default:
                iconObj = normImage;
        }

        return iconObj;

    }
}