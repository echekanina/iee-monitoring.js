import IeecloudViewer2dService from "./IeecloudViewer2dService";

import normImage from './assets/norm3.gif'
import emergencyImage from './assets/emergency.gif'
import warningImage from './assets/warning.gif'
import './styles/style.scss';
import {eventBus} from "../../../../../main/index.js";
import {v4 as uuidv4} from "uuid";


export default class IeecloudViewer2dRenderer {
    model;
    #node;
    #params;

    #SENSOR_WIDTH = 17
    #SENSOR_HEIGHT = 17
    #renderModel;

    constructor(model, node, params) {
        this.#node = node;
        this.model = model;
        this.#params = params;

        this.#renderModel = this.#node.properties.viewer2dModel;

        if (this.#params) {
            const modelUrl = this.#renderModel.replace(".png", this.#params + ".png");
            this.#renderModel = modelUrl;
        }
    }


    generateParentTemplate() {
        return `<div class="viewer-area" id="viewer2d-area-` + this.#node.id + `" style="width: 100%">
<img id="viewerImg" style="width: 100%;" src="` + this.#renderModel + `" alt="">
                                </div>
                                   `;
    }


    generateSVGTemplate(bgImageNaturalWidth, bgImageNaturalHeight) {
        return `
          <svg  viewBox="0 0 ` + bgImageNaturalWidth + ` ` + bgImageNaturalHeight + `" id="svg-viewer2d-` + this.#node.id + `"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <image  width="100%" height="100%" x="0" y="0"  href="` + this.#renderModel + `">
      </image>
    SENSORS
</svg>
                               `;
    }

    addSensor(x, y, item) {

        let srcImg = this.#findIcon(item.state);

        return '<image sensor-id="' + item.id + '"  id="svg-sensor-' + this.#node.id + ':' + uuidv4() + '" x="' + x + '" y="' + y + '" width="' + this.#SENSOR_WIDTH + ' "  height="' + this.#SENSOR_HEIGHT + ' " href="' + srcImg + ' " style="cursor: pointer" ><title>' + item.name + '</title></image>';
    }


    render(container) {
        const scope = this;
        container.innerHTML = '';

        const nodeProps = this.#node.properties;
        const service = new IeecloudViewer2dService(nodeProps.dataService);


            service.readScheme(nodeProps, function (result) {
                service.readData(nodeProps, result, function (data) {
                    scope.#render2D(data, container);
                });
            });
    }



    #render2D(data, container) {
        const scope = this;

        let parentTemplate = this.generateParentTemplate();


        container.insertAdjacentHTML('beforeend', parentTemplate);


        const elementContainer = document.querySelector("#viewer2d-area-" + this.#node.id);

        if (elementContainer) {

            let imageElement = new Image();
            imageElement.src = this.#renderModel;
            imageElement.onload = function () {

                const bgImageNaturalWidth = this.naturalWidth;
                const bgImageNaturalHeight = this.naturalHeight;

                const parentImage = document.getElementById('viewerImg');
                const width = parentImage.width;
                const height = parentImage.height;
                parentImage.classList.add("d-none");


                let htmlSvg = scope.generateSVGTemplate(width, height);
                let htmlShapes = "";
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];


                    const coordsFactorX = (width / bgImageNaturalWidth);
                    const coordsFactorY = (height / bgImageNaturalHeight);

                    let sensorXCoordinate = (item.coordsData?.coords.x) * coordsFactorX - (scope.#SENSOR_WIDTH / 2);
                    let sensorYCoordinate = (item.coordsData?.coords.y) * coordsFactorY - (scope.#SENSOR_HEIGHT / 2);

                    htmlShapes = htmlShapes + scope.addSensor(sensorXCoordinate, sensorYCoordinate, item);
                }

                if (!scope.#params) {
                    htmlSvg = htmlSvg.replaceAll('SENSORS', htmlShapes);
                }

                elementContainer.insertAdjacentHTML('beforeend', htmlSvg);

                const sensorsSvgElements = document.querySelectorAll('[id^="svg-sensor-' + scope.#node.id + '"]');

                if (sensorsSvgElements && sensorsSvgElements.length > 0) {
                    sensorsSvgElements.forEach(function (sensorElement) {
                        sensorElement?.addEventListener('click', function (event) {
                            const itemId = event.target.getAttribute('sensor-id');
                            if (itemId) {
                                const data = {groupId: itemId, activeNode: scope.#node}
                                eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
                            }

                        });
                    });
                }
            }
        }
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