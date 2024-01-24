import {IeecloudAutoCompleteRenderer} from "../../../../../../main/common/autocomplete/IeecloudAutoCompleteRenderer.js";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";
import {find, some} from "lodash-es";

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

        const startedModeProgrammatically = params.key === 'programmatically';

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
        params.valuesGetFunction.call(params.caller, params.valuesGetFunctionParams).then((autoCompleteList) => {

            if (scope.params.node.rowPinned && startedModeProgrammatically) {
                    scope.#customRenderer.drawAutoComplete(autoCompleteList);
                    if (autoCompleteList && autoCompleteList.length === 1) { // if only one item in dropdown do autoselect
                        scope.#customRenderer.doActiveItem(autoCompleteList[0]);
                    } else if(autoCompleteList && (autoCompleteList.length > 1 || autoCompleteList.length === 0)) {
                        const currentCellValue = scope.params.data[scope.params.column.colId];
                        if (currentCellValue) {
                            const itemToSearch = {id: currentCellValue.key, name: currentCellValue.name};
                            const foundItem = find(autoCompleteList, itemToSearch);
                            if (foundItem) {
                                scope.#customRenderer.doActiveItem(foundItem);
                            } else {
                                scope.#customRenderer.clearValue();
                            }
                        } else {
                            // scope.#customRenderer.doActiveItem(autoCompleteList[0]); //autoselect first item ?????
                        }
                    }

            } else {
                // if user start edit cell just show autocomplete
                scope.#customRenderer.drawAutoComplete(autoCompleteList);
            }
        });


        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.setActiveNode', function (event) {
            scope.selectValue = {
                key : event.value.value,
                name : event.value.valueName
            };
            params.api.stopEditing();
        });

        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.unSetActiveNode', function (event) {
            scope.selectValue = undefined;
            scope.value = undefined;
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