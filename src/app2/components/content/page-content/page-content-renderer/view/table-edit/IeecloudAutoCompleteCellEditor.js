import {IeecloudAutoCompleteRenderer} from "../../../../../../main/common/autocomplete/IeecloudAutoCompleteRenderer.js";

export default class IeecloudAutoCompleteCellEditor {
    eGui;
    selectValue;
    #customRenderer;


    getValue() {
        return this.selectValue ? this.selectValue : this.value;
    }

    getGui() {
        return this.eGui;
    }


    init(params) {
        const scope = this;
        this.params = params;
        this.value = this.params.value;

        if(!this.params.data[this.params.masterField]){
            return;
        }

        scope.#customRenderer = new IeecloudAutoCompleteRenderer(null, {
            updateInputAfterSelectItem: true,
            inputValue: this.params.value?.name ? this.params.value?.name : '',
            model: params.colDef.field,
            repoCode: params.colDef.repoCode,
            selectGroupData: 'auto' + '-' + params.colDef.field
        });

        this.eGui = document.createElement('div');
        this.eGui.style.width = '100%'




        this.eGui.innerHTML = scope.#customRenderer.generateTemplate();
        params.valuesGetFunctionParams.filterParams = this.params.data[this.params.masterField]
        params.valuesGetFunction.call(params.caller, params.valuesGetFunctionParams).then((result) => {
            scope.#customRenderer.drawAutoComplete(result);
        });


        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.setActiveNode', function (event) {
            scope.selectValue = {
                key : event.value.value,
                name : event.value.valueName
            };
            params.api.stopEditing();
        });


        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.fullList', function (event) {
            params.valuesGetFunction.call(params.caller, params.valuesGetFunctionParams).then((result) => {
                scope.#customRenderer.drawAutoComplete(result);
            });
        });

    }

    afterGuiAttached() {
        const widthValueString = window.getComputedStyle(this.eGui.parentNode)['width'];
        const treeWidthValue = parseInt(widthValueString, 10);
        this.eGui.style.width = treeWidthValue + 22 + 'px'; // todo calculate padding
        this.#customRenderer?.addDomListeners();
    }

    destroy() {
        this.#customRenderer?.destroy();
    }

    isPopup() {
        return true;
    }
}