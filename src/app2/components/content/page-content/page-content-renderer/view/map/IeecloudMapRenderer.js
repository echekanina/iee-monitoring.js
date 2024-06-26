import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import {v4 as uuidv4} from "uuid";
import leafRedImage from './assets/emergency.gif'
import leafGreenImage from './assets/norm3.gif'
import leafOrangeImage from './assets/warning.gif'
import {eventBus} from "../../../../../../main/index.js";

export default class IeecloudMapRenderer {
    #dataMap;
    #uuid;
    #node;
    #mapType;
    #zoomMap;
    #mapSettings;


    constructor(node, mapType, zoomMap, mapSettings) {
        this.#node = node;
        this.#zoomMap = zoomMap;
        this.#mapSettings = mapSettings;
        this.#mapType = mapType;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div id="spinner-container">
        <div id="map-` + this.#uuid + `" style="width: 100%; height: 600px;"></div></div>
    `;
    }

    destroy() {
        const scope = this;
        if (scope.#dataMap && scope.#dataMap.remove) {
            scope.#dataMap.off();
            scope.#dataMap.remove();
        }
    }

    render(container) {
        const scope = this;

        container.insertAdjacentHTML('beforeend', scope.generateTemplate());

        let zoom = 12;
        scope.#dataMap = L.map('map-' + scope.#uuid).setView([59.937500, 30.308611], zoom);

        scope.#updateMapTileLayer()

        // TODO:add common solution for all views
        const spinner = `<div style="position: absolute;left:40%;top:50%;z-index:1000;width: fit-content;" id="map-spinner">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        let spinnerContainer = document.querySelector("#spinner-container");
        spinnerContainer.insertAdjacentHTML('beforeend', spinner);
    }

    renderMap(data) {
        const scope = this;

        let spinnerContainer = document.querySelector("#map-spinner");
        spinnerContainer?.remove();

        let mainAddress;
        let zoom = scope.#zoomMap[this.#node?.schemeId] ? scope.#zoomMap[this.#node?.schemeId] : 12;
        if (data.length > 1) {
            // TODO: calculate center by all addresses in the map. Now just hardcode
            if (data.length % 2 === 0) {
                mainAddress = data[data.length / 2].latlng;
            } else {
                mainAddress = data[(data.length - 1) / 2].latlng;
            }

        }

        if (data.length === 1) {
            mainAddress = data[0].latlng;
        }

        if(scope.#dataMap){
            scope.#dataMap.setView(mainAddress, zoom);
        }

        scope.markers = {};
        data.forEach(function (property, index) {

            let mapDataObj = property;
            scope.markers[index] = L.marker(mapDataObj.latlng, {
                'title': mapDataObj.title,
                icon: scope.#findIcon(mapDataObj.icon)
            }).addTo(scope.#dataMap).on('click', function (e) {
                const data = {objId: mapDataObj.id, activeNode: scope.#node}
                eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
            });
        });
    }

    #findIcon(iconName) {
        let LeafIcon = L.Icon.extend({
            options: {
                iconSize: [70 / 2, 70 / 2],
                shadowSize: [50 / 2, 64 / 2],
                iconAnchor: [22 / 2, 40 / 2],
                shadowAnchor: [4 / 2, 62 / 2],
                popupAnchor: [-3, -76]
            }
        });

        let greenIcon = new LeafIcon({iconUrl: leafGreenImage}),
            redIcon = new LeafIcon({iconUrl: leafRedImage}),
            orangeIcon = new LeafIcon({iconUrl: leafOrangeImage});

        let iconObj;

        switch (iconName) {
            case 'greenIcon': {
                iconObj = greenIcon;
                break;
            }
            case 'redIcon': {
                iconObj = redIcon;
                break;
            }
            case 'orangeIcon': {
                iconObj = orangeIcon;
                break;
            }
            default:
                iconObj = greenIcon;
        }

        return iconObj;

    }

    changeViewType(value){
        this.#mapType = value;
        this.#updateMapTileLayer();
    }


    #updateMapTileLayer() {
        const scope = this;
        if (!scope.#dataMap) {
            console.error('Map has not created yet');
            return;
        }
        let mapLayerUrl = scope.#mapSettings[scope.#mapType]?.url ? scope.#mapSettings[scope.#mapType]?.url : scope.#mapSettings['default']?.url;
        let mapLayerOptions = scope.#mapSettings[scope.#mapType]?.options ? scope.#mapSettings[scope.#mapType]?.options : scope.#mapSettings['default']?.options;
        if (mapLayerUrl && mapLayerOptions) {
            L.tileLayer(mapLayerUrl, mapLayerOptions).addTo(scope.#dataMap);
        }
    }

    fullScreen(){
        const bodyContainerElement = document.getElementById("map-" + this.#uuid);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }
}