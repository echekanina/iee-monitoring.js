export default class IeecloudBreadCrumb {
    layoutModel;
    observableObject
    #template = ``;

    constructor(layoutModel, observableObject) {
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;

    }

    generateTemplate() {
        const scope = this;
        const reversed = this.layoutModel.reverse();
        const size = reversed.length;
        reversed.forEach(function (item, index) {
            if (index === size - 1) {
                scope.#template = scope.#template + `<li class="breadcrumb-item active" id="breadcrumb-` + item.id + `" aria-current="page">` + item.name + `</li>`
                return;
            }
            scope.#template = scope.#template + `<li class="breadcrumb-item"><a href="#"  id="breadcrumb-` + item.id + `">` + item.name + `</a></li>`
        })
        return scope.#template;
    }

    insertTemplates() {
        const scope = this;
        this.layoutModel.forEach(function (item, index) {
            const breadcrumbItem = document.querySelector("#breadcrumb-" + item.id);
            breadcrumbItem?.addEventListener('click', function (event) {
                console.log("on breadcrumb-click", item)
                scope.observableObject.emit('IeecloudBreadCrumb.click', item.id, false);
            });
        })
    }
}