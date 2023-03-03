import {cloneDeep} from "lodash-es";
import treeSettings from "./tree-settings.json"
import IeecloudTreeStructureOptionsRenderer from "../options-renderer/IeecloudTreeStructureOptionsRenderer.js";
import {eventBus} from "../../../main/index.js";
import {IeecloudSearchBlockRenderer} from "../../topbar/search-block/IeecloudSearchBlockRenderer.js";
import IeecloudSelectRenderer from "../options-renderer/IeecloudSelectRenderer.js";
import {v4 as uuidv4} from "uuid";

export default class IeecloudTreeStructureOptionsController {
    #schemeModel;
    #treeSettings;

    #USER_TREE_SETTINGS_STORAGE_KEY = "userTreeSettings";
    #systemController;
    #optionsRenderer;
    #storedUserSettingsKeyAddition;

    constructor(schemeModel, systemController, storedUserSettingsKeyAddition) {
        this.#storedUserSettingsKeyAddition = storedUserSettingsKeyAddition;
        const userLayoutWithVersion = this.#getUserTreeSettings();
        let userTreeSettings;
        if (userLayoutWithVersion && userLayoutWithVersion.appVersion === __APP_VERSION__) {
            userTreeSettings = userLayoutWithVersion.settings;
        }

        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#treeSettings = userTreeSettings ? cloneDeep(userTreeSettings) : cloneDeep(treeSettings);
    }


    #getUserTreeSettings() {
        const scope = this;
        const storedTreeSettingsString = localStorage.getItem(scope.#USER_TREE_SETTINGS_STORAGE_KEY + this.#storedUserSettingsKeyAddition);
        if (storedTreeSettingsString) {
            return JSON.parse(storedTreeSettingsString);
        }
        return null;
    }

    init(containerId) {
        const scope = this;
        let treeSettingsRender = scope.#buildTreeSettingsRenderModel();

        scope.#optionsRenderer = new IeecloudTreeStructureOptionsRenderer(containerId, scope.#schemeModel);
        scope.#optionsRenderer.render(treeSettingsRender);
    }

    resetTreeOptions() {
        const scope = this;
        scope.#clearUserTreeSettings();
        scope.#optionsRenderer.destroy();
        scope.#optionsRenderer.render(scope.#buildTreeSettingsRenderModel());
        eventBus.emit('IeecloudTreeStructureOptionsController.treeSettingsChanged', this.#mapToUserSettings(), false);
    }

    #buildTreeSettingsRenderModel() {
        const scope = this;
        let layoutToRender = {};
        const settingsStructure = scope.#treeSettings.settingsStructure;

        for (let settingsStructureKey in settingsStructure) {
            const settingGroupItem = settingsStructure[settingsStructureKey];

            if (settingGroupItem.type === "scheme-levels") {
                const nodesMap = scope.#schemeModel.nodesMap;
                for (let schemeId in nodesMap) {
                    this.buildAccordionItem(layoutToRender, settingsStructureKey, settingGroupItem, settingsStructure, schemeId);
                }
            } else {
                this.buildAccordionItem(layoutToRender, settingsStructureKey, settingGroupItem, settingsStructure);
            }

        }
        return layoutToRender;
    }

    buildAccordionItem(layoutToRender, settingsStructureKey, settingGroupItem, settingsStructure, schemeId) {
        const scope = this;
        const selectGroups = scope.#treeSettings.selectGroups;
        let accordionItemKey = settingsStructureKey;
        let accordionItemLabel = settingGroupItem.label;
        if (schemeId) {
            accordionItemKey = schemeId + settingsStructureKey;
            accordionItemLabel = scope.#schemeModel.nodesMap[schemeId].name
        }
        layoutToRender[accordionItemKey] = {
            label: accordionItemLabel,
            type: settingGroupItem.type,
            listGroup: []
        };

        settingsStructure[settingsStructureKey].list.forEach(function (selectGroupId) {
            const selectGroup = selectGroups[selectGroupId];

            const settings = selectGroup.settings;


            settings.forEach(function (setting) {

                let item = {
                    label: selectGroup.label,
                    id: settingsStructureKey + '_' + selectGroupId
                }

                let options = [];

                switch (setting.optionsType) {
                    case "manual":
                        options = cloneDeep(setting.defaultOptions);

                        options.forEach(function (option) {
                            option.selected = option.key === setting.currentValue;
                        });
                        let inputValue = options.find(value => value.key === setting.currentValue);
                        let selectModel = {
                            id: schemeId + "_" + settingsStructureKey + '-' + selectGroupId,
                            model: setting.model,
                            options: options,
                            inputValue: inputValue ? inputValue.value : ''
                        }
                        item.selectGroup = {
                            renderer: new IeecloudSelectRenderer(selectModel)
                        }
                        item.selectGroup.renderer.addEventListener('IeecloudSelectRenderer.selectChanged', function (event) {
                            const data = event.value;
                            scope.#updateTreeSettings(data);
                        });

                        break;

                    case "node":
                        const defaultActiveTreeNode = scope.#systemController.getNodeById(setting.currentValue);
                        item.searchGroup = {
                            renderer: new IeecloudSearchBlockRenderer(null, {
                                updateInputAfterSelectItem: true,
                                inputValue: defaultActiveTreeNode ? defaultActiveTreeNode.text : '',
                                model: setting.model,
                                selectGroupData: settingsStructureKey + '-' + selectGroupId
                            })
                        }
                        item.searchGroup.renderer.addEventListener('IeecloudSearchBlockRenderer.searchNode', function (event) {
                            const searchText = event.value;
                            const nodes = scope.#systemController.searchNode(searchText);
                            item.searchGroup.renderer.drawAutoComplete(nodes);
                        });

                        item.searchGroup.renderer.addEventListener('IeecloudSearchBlockRenderer.setActiveNode', function (event) {
                            const data = event.value;
                            scope.#updateTreeSettings(data);
                        });


                        break;
                    case "nodeScheme":

                        const nodesMap = scope.#schemeModel.nodesMap;

                        for (let key in nodesMap) {
                            options.push({key: key, value: nodesMap[key].name, selected: key === setting.currentValue});
                        }
                        let inputModelValue = options.find(value => value.key === setting.currentValue);
                        item.selectGroup = {
                            renderer: new IeecloudSelectRenderer({
                                id: uuidv4() + "_" + settingsStructureKey + '-' + selectGroupId,
                                model: setting.model,
                                options: options,
                                inputValue: inputModelValue ? inputModelValue.value : ''
                            })
                        }
                        item.selectGroup.renderer.addEventListener('IeecloudSelectRenderer.selectChanged', function (event) {
                            const data = event.value;
                            scope.#updateTreeSettings(data);
                        });
                        break;
                    default:
                }
                layoutToRender[accordionItemKey].listGroup.push(item);
            });
        });
    }

    #storeUserLayout() {
        const scope = this;
        const useTreeSettingsWithVersion = { appVersion: __APP_VERSION__ , settings: scope.#treeSettings};
        localStorage.setItem(scope.#USER_TREE_SETTINGS_STORAGE_KEY + this.#storedUserSettingsKeyAddition, JSON.stringify(useTreeSettingsWithVersion));
    }

    #clearUserTreeSettings() {
        const scope = this;
        scope.#treeSettings = cloneDeep(treeSettings);
        localStorage.removeItem(scope.#USER_TREE_SETTINGS_STORAGE_KEY + this.#storedUserSettingsKeyAddition);
    }

    get treeSettings() {
        return this.#mapToUserSettings();
    }

    #updateTreeSettings(data) {
        const scope = this;
        const settingKetPair = data.selectGroupData.split('-');
        const settingGroup = scope.#treeSettings.selectGroups[settingKetPair[1]];
        if (settingGroup) {
            let settingModel = settingGroup.settings.find(item => item.model === data.model);
            if (!settingModel) {
                console.error(`Setting with model ${data.model} not found`)
                return;
            }
            switch (settingModel.type) {
                case "bool":
                    if (data.schemeId) {
                        settingModel[data.schemeId + "_currentValue"] = data.value === "true";
                    } else {
                        settingModel.currentValue = data.value === "true";
                    }

                    break;
                case "string":
                    settingModel.currentValue = data.value
                    break;
            }
        }

        scope.#storeUserLayout();
        eventBus.emit('IeecloudTreeStructureOptionsController.treeSettingsChanged', this.#mapToUserSettings(), false);
    }

    #mapToUserSettings() {
        const scope = this;
        let treeUserSettings = {};

        const treeOptions = scope.#treeSettings.selectGroups;
        const nodesMap = scope.#schemeModel.nodesMap;
        for (let key in treeOptions) {
            const settingsItemArray = treeOptions[key].settings;

            settingsItemArray.forEach(function (setting) {
                treeUserSettings[setting.model] = setting.currentValue;

                for (let schemeId in nodesMap) {
                    if (setting.hasOwnProperty(schemeId + "_currentValue")) {
                        treeUserSettings[schemeId + "_" + setting.model] = setting[schemeId +  "_currentValue"];
                    }
                }
            })

        }
        return treeUserSettings;
    }
}