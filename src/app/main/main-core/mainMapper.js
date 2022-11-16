export default class IeecloudAppMapper {
    #sideBarIconsMap;

    constructor() {
        this.#sideBarIconsMap = {};

        this.#sideBarIconsMap["mo1"] = 'fas fa-fw fa-tachometer-alt';
        this.#sideBarIconsMap["an1"] = 'fas fa-fw fa-chart-area';
        this.#sideBarIconsMap["repo1"] = 'fas fa-fw fa-table';
        this.#sideBarIconsMap["event1"] = 'fas fa-fw fa-calendar';

    }

    map(result) {
        const scope = this;
        let viewModel = {};
        viewModel.showSettings = result.showSettings;
        viewModel.topBar = {
            name: result.application.properties.name,
            searchBar: true,
            userBar: true
        };
        viewModel.sideBar = {
            children: [{
                name: "Мониторинг",
                children: []
            }]
        };
        viewModel.content = {};
        result.application.modules.forEach(function (item) {
            let moduleItemModel = {
                name: item.name,
                id: item.id,
                code: item.code,
                data: item.data,
                actions: item.actions,
                icon: scope.#sideBarIconsMap[item.id]
            };
            // add to menu item cause in the future can be different dataSources
            moduleItemModel.data.dataService = result.application.properties.dataService;
            viewModel.sideBar.children[0].children.push(moduleItemModel)
        });
        return viewModel;
    }
}