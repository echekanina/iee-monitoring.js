import IeecloudViewer2dService from "./IeecloudViewer2dService";

import normImage from './assets/norm3.gif'
import emergencyImage from './assets/emergency.gif'
import warningImage from './assets/warning.gif'
import './styles/style.scss';
import {eventBus} from "../../../../../main/index.js";


export default class IeecloudViewer2dRenderer {
    model;
    #node;
    #data;
    #sensorImages = [];

    #SENSOR_WIDTH = 17
    #SENSOR_HEIGHT = 17

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
        console.log("render", container)
        const viewTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', viewTemplate);

        const nodeProps = this.#node.properties;
        const service = new IeecloudViewer2dService(nodeProps.dataService);
        service.readScheme(nodeProps, function (result) {
            service.readData(nodeProps, result, function (data) {
                scope.#render2D(data);
            });
        });

        // TODO : look observer
        const resizeObserver = new ResizeObserver(entries => {
            if (scope.#data && scope.#sensorImages.length > 0) {
                // const containerImages = document.getElementById('viewer2d');
                // // if(!containerImages){
                // //     // scope.#sensorImages = [];
                // //     // resizeObserver.unobserve(container);
                // //     return;
                // // }
                // scope.#sensorImages.forEach(function (item) {
                //     containerImages?.removeChild(item);
                // });
                // scope.#sensorImages = [];
                // scope.#render2D(scope.#data);
                console.log(scope.#data)
                resizeObserver.unobserve(container);
            }
        });

        resizeObserver.observe(container);
    }

    #render2D(data) {

        const scope = this;
        scope.#data = data;
        const container = document.getElementById('viewer2d');

        const parentImage = document.getElementById('viewerImg');
        // if(!parentImage) {
        //     console.error(`Cannot find model image.  Url: ${this.#node.properties.viewer2dModel} `);
        //     return;
        // }
        data.forEach(function (item) {
            if (item.coordsData?.coords?.x && item.coordsData?.coords?.y) {
                let srcImg = scope.#findIcon(item.state);
                const newImage = scope.#createImgElement(srcImg, "sensor-" + item.id, 'overlays');
                newImage.setAttribute('src', srcImg);
                newImage.setAttribute('class', 'overlays');
                newImage.setAttribute('node-link-id', item.id);
                let left = item.coordsData.coords.x * (parentImage.width / parentImage.naturalWidth) - (scope.#SENSOR_WIDTH / 2);
                let top = item.coordsData.coords.y * (parentImage.width / parentImage.naturalWidth) - (scope.#SENSOR_HEIGHT / 2);
                newImage.style.left = left + "px";
                newImage.style.top = top + "px";
                scope.#sensorImages.push(newImage);
                container.appendChild(newImage);


                newImage?.addEventListener('click', function (event) {
                    const data = {groupId: item.id, activeNode: scope.#node}
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