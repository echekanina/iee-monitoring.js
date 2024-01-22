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

        // TODO: find to disable by another way
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

        let filterUrlFields = {};

        this.params.filterFields.forEach(function(keyField){
            filterUrlFields[keyField] = scope.params.data[keyField]?.key ?  scope.params.data[keyField]?.key :
                scope.params.data[keyField];
        });

        params.valuesGetFunctionParams.filterFields = filterUrlFields;
        params.valuesGetFunction.call(params.caller, params.valuesGetFunctionParams).then((result) => {
            scope.#customRenderer.drawAutoComplete(result);
            if (result && result.length === 1) {
                scope.#customRenderer.doActiveItem(result[0]);
            }

            if (result && result.length === 0) {
                console.warn(`Drop down list data for column ${this.params.column.colId} is empty`)
                params.api.stopEditing();
            }
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
        if (!this.eGui) {
            return;
        }
        this.eGui.style.width = this.params.column.actualWidth + 'px'; // todo calculate padding
        this.#customRenderer?.addDomListeners();
    }

    destroy() {
        this.#customRenderer?.destroy();
    }

    isPopup() {
        return true;
    }
}