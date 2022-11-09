export default class IeecloudSideBar {
    model;
    #itemsTemplate = ``;
    #nameTemplate = ``;

    constructor(model) {
        this.model = model;
    }

    generateTemplate() {
        let template = `
       <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

          <!-- Divider -->
          <hr class="sidebar-divider d-none d-md-block">

          <!-- Sidebar Toggler (Sidebar) -->
          <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
          </div>

        </ul>`


        this.#nameTemplate =  ` <!-- Sidebar - Brand -->
          <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
            <div class="sidebar-brand-text mx-3">` + this.model.name + `</div>
          </a>

          <!-- Divider -->
          <hr class="sidebar-divider my-0">`

        this.model.children.forEach((node) => {
            this.#itemsTemplate = this.#itemsTemplate +  `<hr class="sidebar-divider"><!-- Heading -->
          <div class="sidebar-heading">
            ` + node.name + `
          </div>`;

            this.#generateChildTemplate(node);
        });

        return template;

    }

    #generateChildTemplate(node) {

        if (node.children && node.children.length > 0) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                this.#itemsTemplate = this.#itemsTemplate +  `<!-- Nav Item - Pages Collapse Menu -->
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="` + child.icon + `"></i>
              <span> ` + child.name + `</span>
            </a>
          </li>`;
                this.#generateChildTemplate(child);

            }
        }

    }

    insertTemplates() {
        const containerElement = document.querySelector("#accordionSidebar");
        containerElement.insertAdjacentHTML('afterbegin', this.#itemsTemplate);
        containerElement.insertAdjacentHTML('afterbegin', this.#nameTemplate);

    }
}