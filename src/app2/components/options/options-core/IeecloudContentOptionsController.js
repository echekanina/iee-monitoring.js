import IeecloudContentOptionsRenderer from "../options-renderer/IeecloudContentOptionsRenderer.js";
import layout from "../../content/page-content/page-content-renderer/content-layout.json";
import {cloneDeep} from "lodash-es";
import {eventBus} from "../../../main/index.js";

export default class IeecloudContentOptionsController {
    #systemController;
    #schemeModel;
    #layoutModel;

    #USER_LAYOUT_STORAGE_KEY = "userLayout";


    get layoutModel() {
        return this.#layoutModel;
    }


    constructor(schemeModel, systemController) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
        const userLayout = this.#getUserLayout();
        this.#layoutModel = this.#getUserLayout() ? cloneDeep(userLayout) : cloneDeep(layout);

    }

    init(containerId) {

        const scope = this;

        let layoutToRender  = scope.#buildContentOptionsRenderModel();

        const optionsRenderer = new IeecloudContentOptionsRenderer(containerId);
        optionsRenderer.render(layoutToRender);

        optionsRenderer.addEventListener('IeecloudContentOptionsRenderer.selectChanged', function (event) {

            const data = event.value;
            let schemeLevel = scope.#layoutModel[data.schemeId];

            switch (data.model) {
                case "dialog":
                    schemeLevel[data.model] = data.value === "true";
                    break;
                case "view":
                case "model":

                    if (schemeLevel.widgetRows[0]?.widgets && schemeLevel.widgetRows[0].widgets?.length > 0) {
                        let widget = schemeLevel.widgetRows[0].widgets.find(widget => widget.id === data.widgetId);
                        if (widget) {
                            widget.widgetContent[data.model] = data.value;
                        }

                    }
                    break;
                default:

            }
            console.log(scope.#layoutModel)
            scope.#storeUserLayout();
            eventBus.emit('IeecloudContentOptionsController.layoutChanged', scope.#layoutModel, false);
        });

        optionsRenderer.addEventListener('IeecloudContentOptionsRenderer.resetOptions', function (event) {
            scope.#clearUserLayout();
            optionsRenderer.destroy();
            optionsRenderer.render(scope.#buildContentOptionsRenderModel());
        });
    }

    #buildContentOptionsRenderModel() {
        let layoutToRender = {};
        const scope = this;
        for (let schemeId in scope.#layoutModel) {

            layoutToRender[schemeId] = {
                label: this.#schemeModel.nodesMap[schemeId].name,
                listGroup: []

            };

            let item1 = {
                label: 'Контейнер',
                id: schemeId + '_' + 'empty' + '_dialog',
                selectGroup: {
                    model: 'dialog',
                    options: [{value: 'Диалог', key: true, selected: scope.#layoutModel[schemeId].dialog}, {
                        value: 'Default',
                        key: false,
                        selected: !scope.#layoutModel[schemeId].dialog
                    }]
                }
            }


            layoutToRender[schemeId].listGroup.push(item1);


            let item2 = {label: 'Виджеты', id: schemeId + '-widgets', listGroup: []};

            layoutToRender[schemeId].listGroup.push(item2);

            const widgets = scope.#layoutModel[schemeId].widgetRows[0].widgets;


            widgets.forEach(function (widget) {
                let widgetItem = {label: widget.name, listGroup: []};
                item2.listGroup.push(widgetItem)
                if (widget.hasOwnProperty("viewActions")) {
                    let viewItem = {
                        label: 'Вид Отображения',
                        widgetId: widget.id,
                        id: schemeId + '_' + widget.id + '_view',
                        selectGroup: {model: 'view', options: []}
                    };
                    widgetItem.listGroup.push(viewItem);
                    const defaultView = widget.widgetContent.view;
                    widget.viewActions.forEach(function (viewAction) {
                        let option = {value: viewAction.name, key: viewAction.view};
                        option.selected = option.key === defaultView;
                        viewItem.selectGroup.options.push(option)
                    });
                }


                if (widget.hasOwnProperty("modelDataActions")) {
                    let viewItem = {
                        label: 'Moдель данных',
                        widgetId: widget.id,
                        id: schemeId + '_' + widget.id + '_model',
                        selectGroup: {model: 'model', options: []}
                    };
                    widgetItem.listGroup.push(viewItem);
                    const defaultModel = widget.widgetContent.model;
                    widget.modelDataActions.forEach(function (modelDataAction) {
                        let option = {value: modelDataAction.name, key: modelDataAction.model};
                        option.selected = option.key === defaultModel;
                        viewItem.selectGroup.options.push(option);
                    });
                }
            });
        }

        return layoutToRender;
    }

    #storeUserLayout() {
        const scope = this;
        localStorage.setItem(scope.#USER_LAYOUT_STORAGE_KEY, JSON.stringify(scope.#layoutModel));
    }

    #clearUserLayout() {
        const scope = this;
        scope.#layoutModel = cloneDeep(layout);
        localStorage.removeItem(scope.#USER_LAYOUT_STORAGE_KEY);
    }

    #getUserLayout() {
        const scope = this;
        const storedLayoutString = localStorage.getItem(scope.#USER_LAYOUT_STORAGE_KEY);
        if (storedLayoutString) {
            return JSON.parse(storedLayoutString);
        }
        return null;
    }
}