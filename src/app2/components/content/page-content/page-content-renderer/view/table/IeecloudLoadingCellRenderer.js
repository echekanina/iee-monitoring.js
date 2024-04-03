export default class IeecloudLoadingCellRenderer {
    init(params) {

        if (params.column.left === 0 && params.rowIndex === 0 && !params.value) {
            this.eGui = document.createElement('div');
            this.eGui.innerHTML = `
            <div class="ag-custom-loading-cell" >  
                <i class="fa-solid fa-spinner fa-spin"></i> 
                <span>${params.loadingMessage} </span>
            </div>
        `;
        } else if(params.value){
            this.eGui = document.createElement('span');
            this.eGui.innerHTML = params.value
        }


    }

    getGui() {
        return this.eGui;
    }
}