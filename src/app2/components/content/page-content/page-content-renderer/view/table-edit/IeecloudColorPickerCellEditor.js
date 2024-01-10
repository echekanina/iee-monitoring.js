import {IeecloudColorPickerRenderer} from "../../../../../../main/common/colorpicker/IeecloudColorPickerRenderer.js";

export default class IeecloudColorPickerCellEditor {
    eGui;
    #renderer;


    getValue() {
        return this.value;
    }

    getGui() {
        return this.eGui;
    }


    init(params) {
        const scope = this;
        this.params = params;
        this.value = this.params.value;

        scope.#renderer = new IeecloudColorPickerRenderer({
            inputValue: this.params.value,
            disabled: !this.params.data[this.params.masterField]
        });

        this.eGui = document.createElement('div');
        this.eGui.innerHTML = scope.#renderer.generateTemplate();
        scope.#renderer.addEventListener('IeecloudColorPickerRenderer.valueSet', function (event) {
            scope.value = event.value;
        });

        scope.#renderer.addEventListener('IeecloudColorPickerRenderer.pickerClosed', function (event) {
            params.api.stopEditing();

        });
    }

    afterGuiAttached() {
        if (!this.eGui) {
            return;
        }
        this.eGui.style.width = this.params.column.actualWidth + 'px';
        this.eGui.style['text-align'] = 'center';
        this.#renderer?.render();
    }

    destroy() {
        this.#renderer?.destroy();
    }

    isPopup() {
        return false;
    }
}