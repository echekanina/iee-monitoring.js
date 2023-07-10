import jspreadsheet from "jspreadsheet-ce";
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import "lemonadejs";
import 'jsuites/dist/jsuites.js'
import 'jsuites/dist/jsuites.css'
import './styles/edit-grid.scss';
import IeecloudWidgetBodyEditService from "./IeecloudWidgetBodyEditService.js";

export default class IeecloudWidgetBodyEditRenderer {
    #node;
    #container;
    #editGrid;

    #mode; // 'EDIT'/'NEW'
    #columnDefs;
    #fixedFullFields;
    #widgetBodyEditService;

    constructor(containerId, activeNode, mode, widgetBodyEditService) {
        const nodeProps = activeNode.properties;
        this.#widgetBodyEditService = widgetBodyEditService ?  widgetBodyEditService : new IeecloudWidgetBodyEditService(nodeProps.dataService, nodeProps);
        this.#node = activeNode;
        this.#mode = mode ? mode : 'EDIT';
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate() {

        return ` <div  class="widget-body-edit-content" id="widget-body-edit-` + this.#node.id + this.#mode + `">
   
  <div id="widget-spreadsheet-edit-` + this.#node.id + this.#mode + `" style="margin-top: 10px;"></div>
                                    </div>
`;
    }

    destroy() {
        const scope = this;
        if (scope.#editGrid) {
            scope.#editGrid.destroy();
            scope.#container.innerHTML = '';
        }
    }

    getDataToSave(){
        const scope = this;
        let fixedData = {};
        scope.#fixedFullFields?.forEach(function(item){
            fixedData[item.field] = document.querySelector("#" + item.field)?.value;
        });
        return {
            data: scope.#editGrid.getData(),
            header: scope.#columnDefs.map(item => item.field),
            fixedData: fixedData
        };
    }

    render(container) {
        const scope = this;
        if (!scope.#container) {
            scope.#container = container;
        }
        if (!scope.#container) {
            return;
        }

        const nodeProps = this.#node.properties;

        scope.#container.innerHTML = '';
        const widgetBodyTemplate = this.generateTemplate();
        scope.#container.insertAdjacentHTML('beforeend', widgetBodyTemplate);

        const editContainer = document.querySelector("#widget-spreadsheet-edit-" + scope.#node.id  + this.#mode);
        const editBodyContainer = document.querySelector("#widget-body-edit-" + scope.#node.id  + this.#mode);


        const spinner = `<div class="d-flex justify-content-center">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        editContainer.insertAdjacentHTML('beforeend', spinner);

        scope.#widgetBodyEditService.buildColumnDefinitionsAndFilter(nodeProps, function (result) {

            scope.#columnDefs = result.columnDefs;
            scope.#fixedFullFields = result.fixedFullFields;

            let mainFilterTemplate = ``


            scope.#fixedFullFields?.forEach(function(item){
                switch(item.type) {
                    case "date":
                        mainFilterTemplate = mainFilterTemplate + `<form class="row">
        <label for="date" class="col-2 col-form-label">` + item.title + `</label>
        <div class="col-3">
            <input id="` + item.field + `" class="form-control" type="date"/>
        </div>
    </form>
                `
                        break;
                    default:
                        break;
                }
            });

            editBodyContainer.insertAdjacentHTML('afterbegin', mainFilterTemplate);

            if (scope.#mode === 'NEW') {
                editContainer.innerHTML = '';
                scope.buildSpreadSheet(editContainer, scope.#columnDefs, []);
                scope.#editGrid.insertRow();
                return;
            }

            scope.#widgetBodyEditService.getEditDataTable(nodeProps, result.columnDefs, function (data) {
                editContainer.innerHTML = '';
                scope.buildSpreadSheet(editContainer, scope.#columnDefs, data);
            });
        });
    }

    buildSpreadSheet(editContainer, columns, data) {
        const scope = this;
        scope.#editGrid = jspreadsheet(editContainer, {
            columns: columns,
            pagination: 30,
            search: true,
            paginationOptions: [30, 50, 100],


            // defaultColWidth: 100,
            // tableOverflow: true,
            // tableWidth: "100%",

            data: data,
            worksheets: [
                {minDimensions: [6, 8]},
                {minDimensions: [6, 8]},
            ],
            text:{
                showingPage: "Показ страницы {0} из {1} записей",
                "show": "Показать ",
                "search": "Поиск",
                "entries": " записей",
            },

            license: 'Y2Y4ODQ2YzY2YTRjNTJhMzU4NTE2ZDg0MmVmYTYzMjBkZDFjZGEwYmE4YWQwNzc0YTVmOGM5N2JkODYzMzdhMTBkODU3ZWNlOGQ5YTZiMmMyZGY5ODg3MWMxNTJmZDJjODY1N2I1NGMzODVlNWI3MTVkMzVhZWUzZWM2NTFhYmEsZXlKdVlXMWxJam9pU25Od2NtVmhaSE5vWldWMElpd2laR0YwWlNJNk1UWTRPREE0T1RZd01Td2laRzl0WVdsdUlqcGJJbXB6Y0hKbFlXUnphR1ZsZEM1amIyMGlMQ0pqYjJSbGMyRnVaR0p2ZUM1cGJ5SXNJbXB6YUdWc2JDNXVaWFFpTENKamMySXVZWEJ3SWl3aWQyVmlJaXdpYkc5allXeG9iM04wSWwwc0luQnNZVzRpT2lJek5DSXNJbk5qYjNCbElqcGJJblkzSWl3aWRqZ2lMQ0oyT1NJc0luWXhNQ0lzSW1Ob1lYSjBjeUlzSW1admNtMXpJaXdpWm05eWJYVnNZU0lzSW5CaGNuTmxjaUlzSW5KbGJtUmxjaUlzSW1OdmJXMWxiblJ6SWl3aWFXMXdiM0owSWl3aVltRnlJaXdpZG1Gc2FXUmhkR2x2Ym5NaUxDSnpaV0Z5WTJnaUxDSndjbWx1ZENJc0luTm9aV1YwY3lKZExDSmtaVzF2SWpwMGNuVmxmUT09',

        });
    }
}