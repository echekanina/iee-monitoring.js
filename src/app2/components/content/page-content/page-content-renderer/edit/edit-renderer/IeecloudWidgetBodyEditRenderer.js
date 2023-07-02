import jspreadsheet from "jspreadsheet-ce";
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import "lemonadejs";
import 'jsuites/dist/jsuites.js'
import IeecloudTableService from "../../table/IeecloudTableService.js";
import bar from '@jspreadsheet/bar'
import 'jsuites/dist/jsuites.css'
import IeecloudWidgetBodyEditService from "./IeecloudWidgetBodyEditService.js";

export default class IeecloudWidgetBodyEditRenderer {
    #node;
    #container;
    constructor(containerId, activeNode) {
        this.#node = activeNode;
        this.#container = document.querySelector("#" + containerId);


    }

    generateTemplate() {
        return ` <div  class="widget-body-edit-content" id="widget-body-edit-` + this.#node.id + `">
 
    <form class="row">
        <label for="date" class="col-1 col-form-label">Дата</label>
        <div class="col-5">
            <input id="date" class="form-control" type="date"/>
        </div>
    </form>
  <div id="widget-spreadsheet-edit-` + this.#node.id + `" style="margin-top: 10px;"></div>
                                    </div>
`;
    }

    render(){
        const scope = this;
        scope.#container.innerHTML = '';
        const widgetBodyTemplate = this.generateTemplate();
        scope.#container.insertAdjacentHTML('beforeend', widgetBodyTemplate);

        const container = document.querySelector("#widget-spreadsheet-edit-" +  scope.#node.id);


        const spinner = `<div class="d-flex justify-content-center">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);


        const nodeProps = this.#node.properties;
        const widgetBodyEditService = new IeecloudWidgetBodyEditService(nodeProps.dataService,  nodeProps);
        widgetBodyEditService.buildColumnDefinitionsAndFilter(nodeProps, function (result) {

            let columns = result.columnDefs;

            widgetBodyEditService.getEditDataTable(nodeProps, result.columnDefs, function (data) {
                container.innerHTML = '';

                let extension = {}
                extension['bar'] = bar;

                jspreadsheet.setExtensions(extension );
                let grid = jspreadsheet(container, {

                    columns: columns,
                    pagination: 30,
                    search: true,
                    paginationOptions: [30,50,100],

                    // bar: true,
                    // tabs: true,
                    data:data,
                    // toolbar: true,
                    worksheets: [
                        { minDimensions: [6, 8] },
                        { minDimensions: [6, 8] },
                    ],

                    license: 'Y2Y4ODQ2YzY2YTRjNTJhMzU4NTE2ZDg0MmVmYTYzMjBkZDFjZGEwYmE4YWQwNzc0YTVmOGM5N2JkODYzMzdhMTBkODU3ZWNlOGQ5YTZiMmMyZGY5ODg3MWMxNTJmZDJjODY1N2I1NGMzODVlNWI3MTVkMzVhZWUzZWM2NTFhYmEsZXlKdVlXMWxJam9pU25Od2NtVmhaSE5vWldWMElpd2laR0YwWlNJNk1UWTRPREE0T1RZd01Td2laRzl0WVdsdUlqcGJJbXB6Y0hKbFlXUnphR1ZsZEM1amIyMGlMQ0pqYjJSbGMyRnVaR0p2ZUM1cGJ5SXNJbXB6YUdWc2JDNXVaWFFpTENKamMySXVZWEJ3SWl3aWQyVmlJaXdpYkc5allXeG9iM04wSWwwc0luQnNZVzRpT2lJek5DSXNJbk5qYjNCbElqcGJJblkzSWl3aWRqZ2lMQ0oyT1NJc0luWXhNQ0lzSW1Ob1lYSjBjeUlzSW1admNtMXpJaXdpWm05eWJYVnNZU0lzSW5CaGNuTmxjaUlzSW5KbGJtUmxjaUlzSW1OdmJXMWxiblJ6SWl3aWFXMXdiM0owSWl3aVltRnlJaXdpZG1Gc2FXUmhkR2x2Ym5NaUxDSnpaV0Z5WTJnaUxDSndjbWx1ZENJc0luTm9aV1YwY3lKZExDSmtaVzF2SWpwMGNuVmxmUT09',

                });


            });
        });
    }
}