import {cloneDeep} from "lodash-es";
import IeecloudPageContentOptionsRenderer from "../options-renderer/IeecloudPageContentOptionsRenderer.js";
import {v4 as uuidv4} from "uuid";
import IeecloudSelectRenderer from "../options-renderer/IeecloudSelectRenderer.js";

import detailsSettings from "./details-settings.json"
import {eventBus} from "../../../main/index.js";

export default class IeecloudPageContentOptionsController {

    #schemeModel;
    #detailsSettingsViewModel;
    #layoutModel;
    #USER_LAYOUT_STORAGE_KEY = "userLayout";
    #optionsRenderer;
    #storedUserSettingsKeyAddition;
    #layoutJsonFile;

    constructor(layoutJsonFile, schemeModel, storedUserSettingsKeyAddition) {
        this.#storedUserSettingsKeyAddition = storedUserSettingsKeyAddition;

        const userLayoutWithVersion = this.#getUserLayout();
        let userLayout;
        if (userLayoutWithVersion && userLayoutWithVersion.appVersion === __APP_VERSION__) {
            userLayout = userLayoutWithVersion.layout;
        }
        this.#schemeModel = schemeModel;
        this.#layoutJsonFile = layoutJsonFile;
        this.#detailsSettingsViewModel = cloneDeep(detailsSettings);
        this.#layoutModel = userLayout ? userLayout : cloneDeep(layoutJsonFile);
    }


    #getUserLayout() {
        const scope = this;
        const storedLayoutString = localStorage.getItem(scope.#USER_LAYOUT_STORAGE_KEY + this.#storedUserSettingsKeyAddition);
        if (storedLayoutString) {
            return JSON.parse(storedLayoutString);
        }
        return null;
    }

    init(containerId) {
        const scope = this;
        let layoutToRender = scope.#buildContentOptionsRenderModel();

        scope.#optionsRenderer = new IeecloudPageContentOptionsRenderer(containerId, scope.#schemeModel);
        scope.#optionsRenderer.render(layoutToRender);
    }

    resetDetailsOptions() {
        const scope = this;
        scope.#clearUserLayout();
        scope.#optionsRenderer.destroy();
        scope.#optionsRenderer.render(scope.#buildContentOptionsRenderModel());
        eventBus.emit('IeecloudContentOptionsController.layoutChanged', scope.#layoutModel, false);
    }

    #buildContentOptionsRenderModel() {
        const scope = this;
        let layoutToRender = {};
        const settingsStructure = scope.#detailsSettingsViewModel.settingsStructure;
        settingsStructure.forEach(function (settingItem) {
            const settingGroupItemId = settingItem.id;
            const settingGroupItem = scope.#detailsSettingsViewModel.settingsGroups[settingGroupItemId];
            if (settingGroupItem.type === "scheme-levels") {
                const nodesMap = scope.#schemeModel.nodesMap;
                for (let schemeId in nodesMap) {
                    let objectToSetting = scope.#layoutModel[schemeId];
                    objectToSetting.name = nodesMap[schemeId].name;
                    scope.#buildSettingItem(objectToSetting, schemeId, layoutToRender, settingGroupItem.list, settingItem.nested);

                }
            } else {
                // TODO
                // scope.#buildSettingItem(settingGroupItemId, layoutToRender, settingGroupItem.list);
            }


        });
        return layoutToRender;
    }

    #buildSettingItem(objectToSetting, schemeId, accordionMap, selectedGroupsIds, nestedSettingItem) {
        const scope = this;
        const selectGroups = scope.#detailsSettingsViewModel.selectGroups;
        const accordionId = schemeId + uuidv4();
        accordionMap[accordionId] = {
            label: objectToSetting?.name,
            id: uuidv4(),
            listGroup: [],
            accordionMap: {}
        };

        selectedGroupsIds.forEach(function (selectGroupId) {
            const selectGroup = selectGroups[selectGroupId];

            const settings = selectGroup.settings;


            settings.forEach(function (setting) {

                let item = {
                    label: selectGroup.label,
                    id: schemeId + '_' + selectGroupId
                }

                let options = [];

                switch (setting.optionsType) {
                    case "manual":

                        if (scope.#layoutJsonFile[schemeId].excludeSettings?.includes(setting.model)) {
                            return;
                        }

                        options = cloneDeep(setting.defaultOptions);

                        options.forEach(function (option) {
                            option.selected = option.key === objectToSetting[setting.model];
                        });
                        let inputValue = options.find(value => value.key === objectToSetting[setting.model]);
                        let selectModel = {
                            id: schemeId + '_' + objectToSetting.id,
                            model: setting.model,
                            options: options,
                            inputValue: inputValue ? inputValue.value : ''
                        }
                        item.selectGroup = {
                            renderer: new IeecloudSelectRenderer(selectModel)
                        }
                        item.selectGroup.renderer.addEventListener('IeecloudSelectRenderer.selectChanged', function (event) {
                            const data = event.value;
                            scope.#updateContentLayoutSettings(data);

                        });

                        break;
                    case "viewActions":
                    case "modelDataActions":
                    case "mapViewActions":
                        if (objectToSetting.hasOwnProperty(setting.optionsType)) {
                            const objectSettingList = objectToSetting[setting.optionsType];
                            const selectedValue = objectToSetting.widgetContent[setting.model];
                            objectSettingList.forEach(function (optionModel) {
                                options.push({
                                    key: optionModel[setting.model],
                                    value: optionModel.name,
                                    selected: optionModel[setting.model] === selectedValue
                                });
                            });

                            let inputValue1 = options.find(value => value.key === selectedValue);
                            let selectModel1 = {
                                // id: uuidv4() + "-" + schemeId + '-' + selectGroupId,
                                id: schemeId + '_' + objectToSetting.id,
                                model: setting.model,
                                options: options,
                                inputValue: inputValue1 ? inputValue1.value : ''
                            }
                            item.selectGroup = {
                                renderer: new IeecloudSelectRenderer(selectModel1)
                            }

                            item.selectGroup.renderer.addEventListener('IeecloudSelectRenderer.selectChanged', function (event) {
                                const data = event.value;
                                scope.#updateContentLayoutSettings(data);
                            });
                        }
                        break;
                    default:
                }
                accordionMap[accordionId].listGroup.push(item);
            });
        });

        if (nestedSettingItem?.id) {
            const settingGroupItemId = nestedSettingItem?.id;
            const settingGroupItem = scope.#detailsSettingsViewModel.settingsGroups[settingGroupItemId];

            if (settingGroupItem.type === 'widget-list') {
                const widgets = scope.#layoutModel[schemeId].widgetRows[0].widgets;
                widgets.forEach(function (widget) {
                    scope.#buildSettingItem(widget, schemeId, accordionMap[accordionId].accordionMap, settingGroupItem.list);
                });
            }
        }
    }

    #updateContentLayoutSettings(data) {
        const scope = this;

        let schemeLevel = scope.#layoutModel[data.schemeId];

        switch (data.model) {
            case "dialog":
                schemeLevel[data.model] = data.value === "true";
                break;
            case "fullScreenEnabled":
                if (schemeLevel.widgetRows[0]?.widgets && schemeLevel.widgetRows[0].widgets?.length > 0) {
                    let widget = schemeLevel.widgetRows[0].widgets.find(widget => widget.id === data.selectGroupData);
                    if (widget) {
                        widget[data.model] = data.value === "true";
                    }
                }
                break;
            case "view":
            case "model":
            case "map":

                if (schemeLevel.widgetRows[0]?.widgets && schemeLevel.widgetRows[0].widgets?.length > 0) {
                    let widget = schemeLevel.widgetRows[0].widgets.find(widget => widget.id === data.selectGroupData);
                    if (widget) {
                        widget.widgetContent[data.model] = data.value;
                    }

                }
                break;
            default:

        }

        scope.#storeUserLayout();
        eventBus.emit('IeecloudContentOptionsController.layoutChanged', scope.#layoutModel, false);
    }


    #storeUserLayout() {
        const scope = this;
        const userLayoutWithVersion = { appVersion: __APP_VERSION__ , layout: scope.#layoutModel};
        localStorage.setItem(scope.#USER_LAYOUT_STORAGE_KEY + this.#storedUserSettingsKeyAddition, JSON.stringify(userLayoutWithVersion));
    }

    #clearUserLayout() {
        const scope = this;
        scope.#layoutModel = cloneDeep(scope.#layoutJsonFile);
        localStorage.removeItem(scope.#USER_LAYOUT_STORAGE_KEY + this.#storedUserSettingsKeyAddition);
    }

    get layoutModel() {
        return this.#layoutModel;
    }
}