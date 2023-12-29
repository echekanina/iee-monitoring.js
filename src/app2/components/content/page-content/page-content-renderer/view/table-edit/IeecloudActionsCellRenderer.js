export default class IeecloudActionsCellRenderer {
    init(params) {
        this.params = params;
        if (this.params.node.rowPinned) {
            this.eGui = document.createElement('span');
            this.eGui.innerHTML = this.params.valueFormatted;
            return;
        }

        const buttonsMetaData = this.params.buttonsMetaData;

        let template =``;

        buttonsMetaData.forEach(function(btnData, index){
            template = template + `<button type="button" data-action-type="${btnData.actionType}"  style="margin-right:0.2rem" class="btn btn-outline-primary btn-sm">` + btnData.name + `</button>`
        });


        this.eGui = document.createElement('div');

        this.eGui.insertAdjacentHTML('afterbegin', template);
    }
    getGui() {
        return this.eGui;
    }
}