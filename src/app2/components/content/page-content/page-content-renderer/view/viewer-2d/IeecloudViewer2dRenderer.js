import normImage from './assets/norm3.gif'
import emergencyImage from './assets/emergency.gif'
import warningImage from './assets/warning.gif'
import './styles/style.scss';
import {eventBus} from "../../../../../../main/index.js";
import {v4 as uuidv4} from "uuid";
import {Modal} from "bootstrap";
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";


export default class IeecloudViewer2dRenderer extends EventDispatcher{
    #node;
    #modelData;

    #SENSOR_WIDTH = 17
    #SENSOR_HEIGHT = 17
    #renderModel;
    #editSensorMode;
    #edit2dNodesContainers;
    #add2DNodeModal;
    #stored2dCoordinates;

    constructor(node, modelData) {
        super();
        this.#node = node;
        this.#modelData = modelData;

        this.#renderModel = this.#node.properties.viewer2dModel;

        if (this.#modelData !== "default") {
            const modelUrl = this.#renderModel.replace(".png", this.#modelData + ".png");
            this.#renderModel = modelUrl;
        }
    }


    generateParentTemplate() {
        return `<div class="viewer-area" id="viewer2d-area-` + this.#node.id + `" style="width: 100%; background-color: white;">
                                </div>
                                   `;
    }

    generateSVGTemplate(bgImageNaturalWidth, bgImageNaturalHeight) {
        return `
          <svg  viewBox="0 0 ` + bgImageNaturalWidth + ` ` + bgImageNaturalHeight + `" id="svg-viewer2d-` + this.#node.id + `"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <image  width="100%" height="100%" x="0" y="0"  id="svg-object-` + this.#node.id  + `"  href="` + this.#renderModel + `?cacheOff=` + Date.now() + `">
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
        container.innerHTML = '';
        // TODO:add common solution for all views
        const spinner = `<div class="d-flex justify-content-center">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);
    }


    render2D(data, container) {
        container.innerHTML = '';
        const scope = this;

        let parentTemplate = this.generateParentTemplate();


        container.insertAdjacentHTML('beforeend', parentTemplate);


        const elementContainer = document.querySelector("#viewer2d-area-" + this.#node.id);

        if (elementContainer) {

            let imageElement = new Image();
            imageElement.src = this.#renderModel + `?cacheOff=` + Date.now();
            imageElement.setAttribute("style", "width:100%")
            imageElement.onload = function () {

                const bgImageNaturalWidth = this.naturalWidth;
                const bgImageNaturalHeight = this.naturalHeight;

                elementContainer.appendChild(imageElement);

                const width = imageElement.width;
                const height = imageElement.height;

                imageElement.setAttribute("class", "d-none");

                let htmlSvg = scope.generateSVGTemplate(width, height);
                let htmlShapes = "";
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];

                    const coordsFactorX = (width / bgImageNaturalWidth);
                    const coordsFactorY = (height / bgImageNaturalHeight);

                    let sensorXCoordinate = (item.coordsData?.coords.x) * coordsFactorX - (scope.#SENSOR_WIDTH / 2);
                    let sensorYCoordinate = (item.coordsData?.coords.y) * coordsFactorY - (scope.#SENSOR_HEIGHT / 2);
                    if (sensorXCoordinate && sensorYCoordinate) {
                        htmlShapes = htmlShapes + scope.addSensor(sensorXCoordinate, sensorYCoordinate, item);
                    }
                }

                if (scope.#modelData === "default") {
                    htmlSvg = htmlSvg.replaceAll('SENSORS', htmlShapes);
                }

                elementContainer.insertAdjacentHTML('beforeend', htmlSvg);

                const sensorsSvgElements = document.querySelectorAll('[id^="svg-sensor-' + scope.#node.id + '"]');

                if (sensorsSvgElements && sensorsSvgElements.length > 0) {
                    sensorsSvgElements.forEach(function (sensorElement) {
                        sensorElement?.addEventListener('click', scope.#sensorClickListener);
                    });
                }

                const bgObjectImage = document.querySelector("#svg-object-" + scope.#node.id);
                bgObjectImage?.addEventListener('click', scope.#bgObjectImageClickListener);

            }
        }
    }


    #sensorClickListener = (event) => {
        let scope = this;
        const itemId = event.target.getAttribute('sensor-id');
        if (itemId) {
            const data = {objId: itemId, activeNode: scope.#node}
            eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
        }
    }

    #bgObjectImageClickListener = (event) => {
        let scope = this;

        if (!scope.#editSensorMode) {
            console.debug("sensor mode turn off")
            return false;
        }

        scope.#stored2dCoordinates = {};

        scope.#stored2dCoordinates.x = event.offsetX;
        scope.#stored2dCoordinates.y = event.offsetY;

        const editContainer = document.getElementById(scope.#edit2dNodesContainers.edit2dNodesModalBody);

        editContainer.innerHTML = '';

        const div = document.createElement('div');

        this.#node.children.forEach(item => {

            const formCheckDiv = document.createElement('div');
            formCheckDiv.classList.add("form-check");

            const formCheckInput = document.createElement('input');
            formCheckInput.type = 'radio';
            formCheckInput.name = "nodeChildRadio";
            formCheckInput.id = item.id;

            formCheckInput.classList.add("form-check-input");


            const formCheckLabel = document.createElement('label');
            formCheckLabel.classList.add("form-check-label");
            formCheckLabel.htmlFor = item.id;

            const text = document.createTextNode(item.text);
            formCheckLabel.appendChild(text);

            formCheckDiv.appendChild(formCheckInput);
            formCheckDiv.appendChild(formCheckLabel);
            div.appendChild(formCheckDiv);
        });
        editContainer?.appendChild(div);

        scope.#add2DNodeModal?.show();
    }

    destroy() {
        let scope = this;
        const sensorsSvgElements = document.querySelectorAll('[id^="svg-sensor-' + scope.#node.id + '"]');

        if (sensorsSvgElements && sensorsSvgElements.length > 0) {
            sensorsSvgElements.forEach(function (sensorElement) {
                sensorElement?.removeEventListener('click', scope.#sensorClickListener);
                sensorElement?.removeEventListener('click', scope.#bgObjectImageClickListener);
            });
        }

        const bgObjectImage = document.querySelector("#svg-object-" + scope.#node.id);

        bgObjectImage?.removeEventListener('click', scope.#bgObjectImageClickListener);
    }

    toggleAddChildNodes(flag, containers){
        const scope = this;
        this.#editSensorMode = flag;
        this.#edit2dNodesContainers = containers;
        const sensorsSvgElements = document.querySelectorAll('[id^="svg-sensor-' + scope.#node.id + '"]');
        if (this.#editSensorMode) {
            const modalElement = document.getElementById(scope.#edit2dNodesContainers.edit2dNodesModal);

            scope.#add2DNodeModal = new Modal(modalElement);

            const btnSaveCoordinateNode = document.querySelector("#" + this.#edit2dNodesContainers.edit2dNodesModalBtn);
            btnSaveCoordinateNode?.addEventListener('click', scope.#addSensorClickListener);

            if (sensorsSvgElements && sensorsSvgElements.length > 0) {
                sensorsSvgElements.forEach(function (sensorElement) {
                    sensorElement?.removeEventListener('click', scope.#sensorClickListener);
                    sensorElement?.addEventListener('click', scope.#bgObjectImageClickListener);
                });
            }

        } else {
            const btnSaveCoordinateNode = document.querySelector("#" + this.#edit2dNodesContainers.edit2dNodesModalBtn);
            btnSaveCoordinateNode?.removeEventListener('click', scope.#addSensorClickListener);
            scope.#add2DNodeModal.dispose();
            if (sensorsSvgElements && sensorsSvgElements.length > 0) {
                sensorsSvgElements.forEach(function (sensorElement) {
                    sensorElement?.addEventListener('click', scope.#sensorClickListener);
                    sensorElement?.removeEventListener('click', scope.#bgObjectImageClickListener);
                });
            }
        }
    }

    #addSensorClickListener = (event) => {
        let scope = this;
        const selectedNodeId = document.querySelector('input[name="nodeChildRadio"]:checked')?.id;
        if (selectedNodeId) {
            const item = {stored2dCoordinates: scope.#stored2dCoordinates, selectedNodeId: selectedNodeId}
            scope.dispatchEvent({type: 'IeecloudViewer2dRenderer.selectNode', value: item});
        }

        scope.#add2DNodeModal.hide();
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

    fullScreen(){
        const bodyContainerElement = document.getElementById("viewer2d-area-" + this.#node.id);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }
}