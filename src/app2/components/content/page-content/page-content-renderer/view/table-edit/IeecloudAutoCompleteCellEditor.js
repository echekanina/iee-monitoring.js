import {IeecloudAutoCompleteRenderer} from "../../../../../../main/common/autocomplete/IeecloudAutoCompleteRenderer.js";
import {find, isRegExp, isString} from "lodash-es";

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
        if (!this.params.data[this.params.masterField]) {
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

        RegExp.quote = function allowSpecialSymbols(str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, '');
        }
    }

    afterGuiAttached() {
        const scope = this;
        if (!this.eGui) {
            return;
        }

        const startedModeProgrammatically = scope.params.key === 'programmatically';

        let filterUrlFields = {};

        scope.params.filterFields.forEach(function (keyField) {
            filterUrlFields[keyField] = scope.params.data[keyField]?.key ? scope.params.data[keyField]?.key :
                scope.params.data[keyField];
        });

        scope.params.valuesGetFunctionParams.filterFields = filterUrlFields;

        scope.#customRenderer.showSmallSpinner(true);

        scope.params.valuesGetFunction.call(scope.params.caller, scope.params.valuesGetFunctionParams).then((autoCompleteList) => {

            scope.#customRenderer.showSmallSpinner(false);

            if (scope.params.node.rowPinned && startedModeProgrammatically) {
                if (autoCompleteList && autoCompleteList.length === 1) { // if only one item in dropdown do autoselect
                    scope.#customRenderer.doActiveItem(autoCompleteList[0]);
                } else if (autoCompleteList && (autoCompleteList.length > 1 || autoCompleteList.length === 0)) {
                    const currentCellValue = scope.params.data[scope.params.column.colId];
                    if (currentCellValue) {
                        const itemToSearch = {id: currentCellValue.key, name: currentCellValue.name};
                        const foundItem = find(autoCompleteList, itemToSearch);
                        if (foundItem) {
                            scope.#customRenderer.doActiveItem(foundItem);
                        } else if(autoCompleteList.length ===0){
                            scope.#customRenderer.clearValue();
                        }  else if(autoCompleteList.length > 0){
                            scope.#customRenderer.doActiveItem(autoCompleteList[0]);
                        }
                    } else if(autoCompleteList.length > 0){
                        scope.#customRenderer.doActiveItem(autoCompleteList[0]);
                    }
                }

            } else {
                // if user start edit cell just show autocomplete
                scope.#customRenderer.drawAutoComplete(autoCompleteList);
            }
        });


        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.setActiveNode', function (event) {
            scope.selectValue = {
                key: event.value.value,
                name: event.value.valueName
            };
            scope.params.api.stopEditing();
        });

        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.unSetActiveNode', function (event) {
            scope.selectValue = undefined;
            scope.value = undefined;
            scope.params.api.stopEditing();
        });


        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.fullList', function (event) {
            scope.params.valuesGetFunction.call(scope.params.caller, scope.params.valuesGetFunctionParams).then((result) => {
                scope.#customRenderer.drawAutoComplete(result);
            });
        });

        scope.#customRenderer.addEventListener('IeecloudAutoCompleteRenderer.autoComplete', function (event) {
            const searchText = event.value;

            scope.params.valuesGetFunction.call(scope.params.caller, scope.params.valuesGetFunctionParams).then((autoCompleteList) => {
                let matchQuery = searchText;
                if (isString(searchText)) {
                    matchQuery = new RegExp(RegExp.quote(matchQuery), 'i');
                }

                let predicate;
                if (isRegExp(matchQuery)) {
                    predicate = item => matchQuery.test(item.name);
                } else {
                    predicate = matchQuery;
                }

                let filterSearch = autoCompleteList.filter(item => {
                    if (predicate(item)) {
                        return true;
                    }
                });
                scope.#customRenderer.drawAutoComplete(filterSearch);

            });


        });

        this.eGui.style.width = this.params.column.actualWidth + 'px';
        this.#customRenderer?.addDomListeners();
    }

    destroy() {
        this.#customRenderer?.destroy();
    }

    isPopup() {
        return true;
    }
}