import './styles/viewer-monitoring.scss';
import {v4 as uuidv4} from "uuid";

export default class IeecloudViewer3dRenderer {
    #renderModel;
    #uuid;
    #viewerOptions;

    #viewerLoaded = false;

    constructor(renderModel) {
        this.#viewerOptions = {enabledControls: true, zoomNotPanDevice: true};
        this.#renderModel = renderModel;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div class="viewer-area">
<div class="viewer-zoom-top"><div class="viewer-zoom-control">
<a  title="Увеличить" role="button" aria-label="Увеличить" id="viewer-zoom-in-` + this.#uuid + `">+</a>
<a  title="Уменьшить" role="button" aria-label="Уменьшить" id="viewer-zoom-out-` + this.#uuid + `">−</a>
<a  title="Переключатель 3d контроллов" class="d-lg-none" role="button" aria-label="Turn on 3d Controls" id="viewer-toggle-controls-` + this.#uuid + `"><i id="viewer-toggle-controls-icon-` + this.#uuid + `" class="fa-solid fa-xs ${(this.#viewerOptions.enabledControls ? "fa-lock-open" : "fa-lock")}"></i></a>
<a  title="Переключатель zoom/pan" class="d-lg-none" role="button" aria-label="Turn on 3d Controls123" id="viewer-zoom-pan-toggle-controls-` + this.#uuid + `"><i id="viewer-zoom-pan-toggle-icon-` + this.#uuid + `" class="fa-solid fa-xs ${(this.#viewerOptions.zoomNotPanDevice ? "fa-arrows-up-down-left-right" : "fa-arrow-right-arrow-left")}"></i></a>
</div></div>
                                       <iframe type="text/html" src="./viewer-frame/viewer-wrapper.html?model=` + this.#renderModel + `&enabledControls=` + this.#viewerOptions.enabledControls + `" width="100%" height="550" id="3dframe_` + this.#uuid + `">
                                       </div>
                                    `;
    }

    render(container) {
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addDomListeners();
    }

    destroy() {
        // TODO : add destroy prev model in viewer
        let scope = this;
        const bodyContainerElement = document.getElementById("3dframe_" + scope.#uuid);
        if (bodyContainerElement) {
            bodyContainerElement.innerHTML = '';
        }

        this.#removeDomListeners();
    }

    loadData(data) {
        const scope = this;
        const bodyContainerElement = document.getElementById("3dframe_" + scope.#uuid);
        bodyContainerElement?.contentWindow.postMessage({data: data});
    }

    fullScreen() {
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }

    #zoomInListener = (event) => {
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        bodyContainerElement?.contentWindow.postMessage({zoomIn: true});
    }

    #zoomOutListener = (event) => {
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        bodyContainerElement?.contentWindow.postMessage({zoomOut: true});
    }

    #toggleZoomPanListener = (event) => {
        let scope = this;
        if (!scope.#viewerLoaded) {
            return false;
        }
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        this.#viewerOptions.zoomNotPanDevice = !this.#viewerOptions.zoomNotPanDevice;
        const toggleZoomPanIcon = document.querySelector("#viewer-zoom-pan-toggle-icon-" + this.#uuid);
        if (this.#viewerOptions.zoomNotPanDevice) {
            if (toggleZoomPanIcon.classList.contains('fa-arrow-right-arrow-left')) {
                toggleZoomPanIcon.classList.remove('fa-arrow-right-arrow-left');
                toggleZoomPanIcon.classList.add('fa-arrows-up-down-left-right');
            }
        } else {
            if (toggleZoomPanIcon.classList.contains('fa-arrows-up-down-left-right')) {
                toggleZoomPanIcon.classList.remove('fa-arrows-up-down-left-right');
                toggleZoomPanIcon.classList.add('fa-arrow-right-arrow-left');
            }
        }
        bodyContainerElement?.contentWindow.postMessage({zoomPanToggle: {value: this.#viewerOptions.zoomNotPanDevice}});
    }

    #toggleControlsListener = (event) => {
        let scope = this;
        if (!scope.#viewerLoaded) {
            return false;
        }
        const bodyContainerElement = document.getElementById("3dframe_" + this.#uuid);
        this.#viewerOptions.enabledControls = !this.#viewerOptions.enabledControls
        const toggleControlsIcon = document.querySelector("#viewer-toggle-controls-icon-" + this.#uuid);
        if (this.#viewerOptions.enabledControls) {
            if (toggleControlsIcon.classList.contains('fa-lock')) {
                toggleControlsIcon.classList.remove('fa-lock');
                toggleControlsIcon.classList.add('fa-lock-open');
            }
        } else {
            if (toggleControlsIcon.classList.contains('fa-lock-open')) {
                toggleControlsIcon.classList.remove('fa-lock-open');
                toggleControlsIcon.classList.add('fa-lock');
            }
        }

        bodyContainerElement?.contentWindow.postMessage({enableControls: {value: this.#viewerOptions.enabledControls}});
    }

    #addDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#viewer-zoom-in-" + this.#uuid);
        zoomIn?.addEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#viewer-zoom-out-" + this.#uuid);
        zoomOut?.addEventListener('click', scope.#zoomOutListener);
        const toggleControls = document.querySelector("#viewer-toggle-controls-" + this.#uuid);
        toggleControls?.addEventListener('click', scope.#toggleControlsListener);
        const toggleZoomPan = document.querySelector("#viewer-zoom-pan-toggle-controls-" + this.#uuid);
        toggleZoomPan?.addEventListener('click', scope.#toggleZoomPanListener);
    }

    #removeDomListeners() {
        const scope = this;
        const zoomIn = document.querySelector("#viewer-zoom-in-" + this.#uuid);
        zoomIn?.removeEventListener('click', scope.#zoomInListener);
        const zoomOut = document.querySelector("#viewer-zoom-out-" + this.#uuid);
        zoomOut?.removeEventListener('click', scope.#zoomOutListener);
        const toggleControls = document.querySelector("#viewer-toggle-controls-" + this.#uuid);
        toggleControls?.removeEventListener('click', scope.#toggleControlsListener);
        const toggleZoomPan = document.querySelector("#viewer-zoom-pan-toggle-controls-" + this.#uuid);
        toggleZoomPan?.removeEventListener('click', scope.#toggleZoomPanListener);
    }

    setViewerLoaded(value) {
        this.#viewerLoaded = value;
    }
}