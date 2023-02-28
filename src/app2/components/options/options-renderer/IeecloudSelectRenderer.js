import EventDispatcher from "../../../main/events/EventDispatcher.js";

export default class IeecloudSelectRenderer extends EventDispatcher {

    #container;
    #selectModel;

    constructor(selectModel) {
        super();
        this.#selectModel = selectModel;
    }

    generateTemplate() {
        let template = `<div class="dropdown" id="select_${this.#selectModel.id}_${this.#selectModel.model}">
<form class="form-inline me-auto  settings-select " autocomplete="off"   data-bs-toggle="dropdown"  >
    <div class="input-group input-group-joined input-group-solid ">
        <input class="form-control pe-0 " type="text"  value="${this.#selectModel.inputValue}" readonly="readonly" id="input_${this.#selectModel.id}_${this.#selectModel.model}" autocomplete="off" style="cursor: pointer">
        <div class="input-group-text dropdown-toggle" style="cursor: pointer">
        </div>
    </div>
</form>
  <ul class="dropdown-menu">
                       `
        this.#selectModel.options.forEach(function (optionModel) {
            let clazz = optionModel.selected ? "active" : "";
            template = template + ` <li><a class="dropdown-item ${clazz}" href="#" value="${optionModel.key}">${optionModel.value}</a></li>`
        });
        template = template + ` </ul></div>`;
        return template;
    }

    render() {
        const template = this.generateTemplate();
        this.#container?.insertAdjacentHTML('afterbegin', template);
    }

    addDomListeners() {
        const scope = this;
        const select = document.getElementById("select_" + this.#selectModel.id + "_" + this.#selectModel.model);
        select?.addEventListener('hidden.bs.dropdown', scope.#selectOptionListener)
    }

    removeDomListeners() {
        const scope = this;
        const select = document.getElementById("select_" + this.#selectModel.id + "_" + this.#selectModel.model);
        select?.removeEventListener('hidden.bs.dropdown', scope.#selectOptionListener)
    }


    #selectOptionListener = (event) => {
        if (event && event.clickEvent && event.clickEvent.target) {
            const dropDownItem = event.clickEvent.target
            if (dropDownItem.classList.contains('dropdown-item')) {
                const selectedValue = dropDownItem.getAttribute('value');
                const selectedText = dropDownItem.text;

                let children = dropDownItem.parentNode?.parentNode?.querySelectorAll('.dropdown-item');
                if (children && children.length > 0) {
                    children.forEach(function (child) {
                        child.classList.remove('active')
                    });
                }
                dropDownItem.classList.add('active')
                if (event.target?.parentNode && event.target?.parentNode.classList.contains('dropdown')) {
                    const dropdown = event.target?.parentNode;
                    let selectData = dropdown.id.split('_');
                    console.log(selectData)
                    const scope = this;
                    let data = {
                        text: selectedText,
                        value: selectedValue,
                        schemeId: selectData[1] && selectData[1]!=="undefined" ? selectData[1] : undefined,
                        selectGroupData: selectData[2],
                        model: selectData[3]
                    }
                    scope.dispatchEvent({type: 'IeecloudSelectRenderer.selectChanged', value: data});
                    const inputElement = document.getElementById("input_" + this.#selectModel.id + "_" + this.#selectModel.model);
                    if (inputElement) {
                        inputElement.value = data.text;
                    }
                }
            }
        }
    }

}