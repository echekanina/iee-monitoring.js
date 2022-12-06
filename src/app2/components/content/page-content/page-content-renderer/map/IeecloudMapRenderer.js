import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import {v4 as uuidv4} from "uuid";
import IeecloudMapService from "./IeecloudMapService.js";
import leafRedImage from './assets/emergency.gif'
import leafGreenImage from './assets/norm3.gif'
import leafOrangeImage from './assets/warning.gif'
import {eventBus} from "../../../../../main/index.js";

export default class IeecloudMapRenderer {
    #dataMap;
    #uuid;
    #node;

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `
        <div id="map-` + this.#uuid + `" style="width: 100%; height: 600px;"></div>
    `;
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', this.generateTemplate());

        const nodeProps = this.#node.properties;
        const mapService = new IeecloudMapService(nodeProps.dataService);
        mapService.readScheme(nodeProps, function (result) {
            mapService.readData(nodeProps, result, function (data) {
                scope.#renderMap(data);
            });
        });
    }

    #renderMap(data) {
        const scope = this;
        let mainAddress;
        let zoom = 16;
        if (data.length > 1) {
            zoom = 18;
            mainAddress = data[data.length / 2].latlng;
        }

        if (data.length === 1) {
            mainAddress = data[0].latlng;
        }

        scope.#dataMap = L.map('map-' + scope.#uuid).setView(mainAddress, zoom);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(scope.#dataMap);

        scope.markers = {};
        data.forEach(function (property, index) {

            let mapDataObj = property;
            scope.markers[index] = L.marker(mapDataObj.latlng, {
                'title': mapDataObj.title,
                icon: scope.#findIcon(mapDataObj.icon)
            }).addTo(scope.#dataMap).on('click', function (e) {
                const data = {groupId : mapDataObj.id, activeNode: scope.#node}
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

        switch (iconName){
            case 'greenIcon':
            {
                iconObj = greenIcon;
                break;
            }
            case 'redIcon':
            {
                iconObj = redIcon;
                break;
            }
            case 'orangeIcon':
            {
                iconObj = orangeIcon;
                break;
            }
            default:
                iconObj = greenIcon;
        }

        return iconObj;

    }
}