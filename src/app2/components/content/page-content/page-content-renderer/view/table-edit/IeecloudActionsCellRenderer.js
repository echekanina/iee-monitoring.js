export default class IeecloudActionsCellRenderer {
    init(params) {
        const scope = this;
        scope.params = params;
        let buttonsMetaData;
        if (scope.params.node.rowPinned) {
            buttonsMetaData = this.params.pinned.buttonsMetaData;
        } else {
            buttonsMetaData = this.params.regular.buttonsMetaData;
        }


        let template = ``;

        buttonsMetaData.forEach(function (btnData, index) {
            template = template + `<button  type="button" ${scope.params.node.rowPinned ? 'disabled' : ''} data-action-type="${btnData.actionType}"  style="margin-right:0.2rem" class="btn btn-outline-primary btn-sm" >` + btnData.name + `</button>`
        });


        this.eGui = document.createElement('div');

        this.eGui.insertAdjacentHTML('afterbegin', template);
    }

    actionsRowPinnedEnable(value) {
        if (this.params.node.rowPinned) {
            const buttons = this.getGui().querySelectorAll('button');
            buttons?.forEach(function (button) {
                button.disabled = !value;
            })
        }
    }

    getGui() {
        return this.eGui;
    }
}