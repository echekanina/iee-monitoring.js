import normImage from './assets/norm3.gif'
import emergencyImage from './assets/emergency.gif'
import warningImage from './assets/warning.gif'
import './styles/style.scss';
import {eventBus} from "../../../../../../main/index.js";
import {Modal, Tooltip} from "bootstrap";
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";


export default class IeecloudViewer2dRenderer extends EventDispatcher {
    #node;
    #modelData;

    #SENSOR_WIDTH = 17
    #SENSOR_HEIGHT = 17
    #renderModel;
    #editSensorMode;
    #edit2dNodesContainers;
    #add2DNodeModal;
    #stored2dCoordinates;
    #coordsFactorX;
    #coordsFactorY;
    #resizeObserver;
    #bgImageNaturalWidth;
    #bgImageNaturalHeight;
    #tooltipIndicator;

    constructor(node, modelData, renderModel, tooltipIndicator) {
        super();
        this.#node = node;
        this.#modelData = modelData;
        this.#renderModel = renderModel;
        this.#tooltipIndicator = tooltipIndicator;
        const scope = this;

        scope.#resizeObserver = new ResizeObserver(entries => {
            // this will get called whenever div dimension changes
            entries.forEach(entry => {
                // recalculate coordsFactor on resize
                console.log('width', entry.contentRect.width);
                console.log('height', entry.contentRect.height);
                scope.#coordsFactorX = (entry.contentRect.width / scope.#bgImageNaturalWidth);
                scope.#coordsFactorY = (entry.contentRect.height / scope.#bgImageNaturalHeight);

                const svgElement = document.querySelector("#svg-viewer2d-" + scope.#node.id);
                if (svgElement) {
                    const xValue = 0;
                    const yValue = 0;
                    const view = `${xValue} ${yValue} ${entry.contentRect.width} ${entry.contentRect.height}`;
                    // svgElement.setAttribute("viewBox", view);
                    // svgElement.setAttribute("width", entry.contentRect.width + '');
                    // svgElement.setAttribute("height", entry.contentRect.height + '');jjjjjjjggggggg
                }

            });
        });
    }


    generateParentTemplate() {
        return `<div class="viewer-area" id="viewer2d-area-` + this.#node.id + `" style="width: 100%; background-color: white;">
                                </div>
                                   `;
    }

    generateSVGTemplate(bgImageNaturalWidth, bgImageNaturalHeight) {
        return `
          <svg  viewBox="0 0 ` + bgImageNaturalWidth + ` ` + bgImageNaturalHeight + `" id="svg-viewer2d-` + this.#node.id + `"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <image  width="100%" height="100%" x="0" y="0"  id="svg-object-` + this.#node.id  + `"  href="` + this.#renderModel + `?cacheOff=` + Date.now() + `">
      </image>
    SENSORS
</svg>
                               `;
    }

    addSensor(x, y, item, tooltipData) {

        let srcImg = this.#findIcon(item.state);

        const tooltipValue = tooltipData.data[item.code] ? tooltipData.data[item.code] : "нет данных"

        return '<a href="#" id="' + item.code + '" class="d-inline-block sensor-tooltip"  data-bs-html="true"' +
            ' data-bs-toggle="tooltip" title="" ' +
            'data-bs-original-title="' + tooltipData.indicatorCode + ' : ' + tooltipValue + '"><image sensor-id="' + item.id + '"  id="svg-sensor-' + this.#node.id + '-' + item.id + '" x="' + x + '" y="' + y + '" width="' + this.#SENSOR_WIDTH + ' "  height="' + this.#SENSOR_HEIGHT + ' " href="' + srcImg + ' " style="cursor: pointer" ></image></a>';
        // return '<image sensor-id="' + item.id + '"  id="svg-sensor-' + this.#node.id + '-' + item.id + '" x="' + x + '" y="' + y + '" width="' + this.#SENSOR_WIDTH + ' "  height="' + this.#SENSOR_HEIGHT + ' " href="' + srcImg + ' " style="cursor: pointer" ><title>' + item.name + '</title></image>';
    }

    changeIndicator(tooltipData){
        const elementContainer = document.querySelector("#viewer2d-area-" + this.#node.id);
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('.sensor-tooltip'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            let tooltip = Tooltip.getInstance(tooltipTriggerEl);
            const tooltipValue = tooltipData.data[tooltipTriggerEl.id] ? tooltipData.data[tooltipTriggerEl.id] : "нет данных"
            tooltipTriggerEl.setAttribute("data-bs-original-title", tooltipData.indicatorCode + ": " + tooltipValue);
            tooltip.dispose();
            let updatedTooltip = Tooltip.getOrCreateInstance(tooltipTriggerEl, {container: elementContainer});
            updatedTooltip.show();
        })
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


    render2D(data, container, tooltipData) {
        const scope = this;
        let imageElement = new Image();
        imageElement.src = this.#renderModel + `?cacheOff=` + Date.now();
        imageElement.setAttribute("style", "width:100%")
        imageElement.onload = function () {
            container.innerHTML = '';
            let parentTemplate = scope.generateParentTemplate();


            container.insertAdjacentHTML('beforeend', parentTemplate);


            const elementContainer = document.querySelector("#viewer2d-area-" + scope.#node.id);

            scope.#bgImageNaturalWidth = this.naturalWidth;
            scope.#bgImageNaturalHeight = this.naturalHeight;

            elementContainer?.appendChild(imageElement);

            const width = imageElement.width;
            const height = imageElement.height;

            imageElement.setAttribute("class", "d-none");

            let htmlSvg = scope.generateSVGTemplate(width, height);
            let htmlShapes = "";
            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                scope.#coordsFactorX = (width / scope.#bgImageNaturalWidth);
                scope.#coordsFactorY = (height / scope.#bgImageNaturalHeight);

                let sensorXCoordinate = (item.coordsData?.coords.x) * scope.#coordsFactorX - (scope.#SENSOR_WIDTH / 2);
                let sensorYCoordinate = (item.coordsData?.coords.y) * scope.#coordsFactorY - (scope.#SENSOR_HEIGHT / 2);
                if (sensorXCoordinate && sensorYCoordinate) {
                    htmlShapes = htmlShapes + scope.addSensor(sensorXCoordinate, sensorYCoordinate, item, tooltipData);
                }
            }

            if (scope.#modelData === "default") {
                htmlSvg = htmlSvg.replaceAll('SENSORS', htmlShapes);
            }

            elementContainer?.insertAdjacentHTML('beforeend', htmlSvg);

            const sensorsSvgElements = document.querySelectorAll('[id^="svg-sensor-' + scope.#node.id + '"]');

            if (sensorsSvgElements && sensorsSvgElements.length > 0) {
                sensorsSvgElements.forEach(function (sensorElement) {
                    sensorElement?.addEventListener('click', scope.#sensorClickListener);
                });
            }

            const bgObjectImage = document.querySelector("#svg-object-" + scope.#node.id);
            bgObjectImage?.addEventListener('click', scope.#bgObjectImageClickListener);

            // start listening resize changes
            scope.#resizeObserver.observe(container);

            let tooltipTriggerList = [].slice.call(document.querySelectorAll('.sensor-tooltip'))
            let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new Tooltip(tooltipTriggerEl, {container: elementContainer})
            })

            tooltipList.forEach(function (elem) {
                elem.show();
            })


        }
    }

    recalculateSensorPosition(childNode, coords) {
        const scope = this;

        let sensorXCoordinate = coords.x * scope.#coordsFactorX - (scope.#SENSOR_WIDTH / 2);
        let sensorYCoordinate = coords.y * scope.#coordsFactorY - (scope.#SENSOR_HEIGHT / 2);

        const sensorElement = document.querySelector("#svg-sensor-" + scope.#node.id + "-" + childNode.id);

        if (sensorElement) {
            sensorElement.setAttribute('x', sensorXCoordinate.toString());
            sensorElement.setAttribute('y', sensorYCoordinate.toString());
        } else {
            scope.dispatchEvent({type: 'IeecloudViewer2dRenderer.addNewSensor', value: childNode});
        }
    }

    addNewSensor(sensorItem) {
        const scope = this;
        const svgElement = document.querySelector("#svg-viewer2d-" + scope.#node.id);
        let sensorXCoordinate = (sensorItem.coordsData?.coords.x) * scope.#coordsFactorX - (scope.#SENSOR_WIDTH / 2);
        let sensorYCoordinate = (sensorItem.coordsData?.coords.y) * scope.#coordsFactorY - (scope.#SENSOR_HEIGHT / 2);
        if (sensorXCoordinate && sensorYCoordinate && svgElement) {
            const newSensorElement = scope.addSensor(sensorXCoordinate, sensorYCoordinate, sensorItem);
            svgElement.insertAdjacentHTML('beforeend', newSensorElement);
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

        scope.#stored2dCoordinates.x = event.offsetX / scope.#coordsFactorX;
        scope.#stored2dCoordinates.y = event.offsetY / scope.#coordsFactorY;

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

        scope.#resizeObserver.disconnect();
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