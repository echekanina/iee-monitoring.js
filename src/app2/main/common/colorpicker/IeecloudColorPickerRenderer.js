import {v4 as uuidv4} from "uuid";
import Alwan from "alwan";
import 'alwan/dist/css/alwan.min.css';
import EventDispatcher from "../../events/EventDispatcher.js";
import IeecloudAppUtils from "../../utils/IeecloudAppUtils.js";
import {slice} from "lodash-es";

export class IeecloudColorPickerRenderer extends EventDispatcher {
    #uuid;
    #colorPickerEntity;
    #params;

    constructor(params) {
        super();
        this.#params = params;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div id="color-picker-holder-` + this.#uuid + `"></div>`;
    }

    addDomListeners() {
        const scope = this;
        scope.#colorPickerEntity.on('color', function(colorObject, source) {
            scope.dispatchEvent({type: 'IeecloudColorPickerRenderer.valueSet', value: colorObject.hex});
        });

        scope.#colorPickerEntity.on('close', function() {
            scope.dispatchEvent({type: 'IeecloudColorPickerRenderer.pickerClosed'});
        });
    }

    render(){
        const scope = this;
        let defaultColors = ['red', 'green', 'blue', 'black'].concat(slice(IeecloudAppUtils.ramdomSaturatedColorList, 0, 14));
        scope.#colorPickerEntity = new Alwan('#color-picker-holder-' + this.#uuid, {
            color: scope.#params?.inputValue,
            disabled: scope.#params?.disabled,
            swatches: defaultColors
        });

        this.addDomListeners();
    }

    open() {
        this.#colorPickerEntity?.open();
    }

    destroy() {
        const scope = this;
        scope.#colorPickerEntity.destroy();
    }

}