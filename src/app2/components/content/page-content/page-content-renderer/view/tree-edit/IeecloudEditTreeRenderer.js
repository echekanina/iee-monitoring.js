import {IeecloudFormBuilder, IeecloudMyTreeInspireView} from "ieecloud-tree";

import './styles/tree-edit-monitoring.scss';
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";
import {Modal} from "bootstrap";

export default class IeecloudEditTreeRenderer extends EventDispatcher {
    #node;
    #viewTreeEditInstance;
    #contextMenu;
    #formBuilderInstance;
    #containerForm = "Form1";
    #nodeModal;

    constructor(node) {
        super();
        const scope = this;
        this.#node = node;

        this.#contextMenu = {
            'context': {
                elements: [
                    {
                        text: 'Create',
                        type: 'create',
                        action: function (scheme, parentNode) {

                            scope.#formBuilderInstance.create(scope.#containerForm, scheme.properties, scope.#containerForm);

                            scope.#nodeModal?.show();

                            scope.#formBuilderInstance.on('formBuilder.submitValues', function (properties) {
                                scope.dispatchEvent({
                                    type: 'IeecloudEditTreeRenderer.createNode', value: {
                                        properties: properties,
                                        scheme: scheme,
                                        parentNode: parentNode
                                    }
                                });
                            });

                            // TODO: does not work???
                            scope.#formBuilderInstance.on('formBuilder.cancelFrom', function () {
                                console.log("cancel")
                                scope.hideModal();
                            });

                        }
                    },
                    {
                        text: 'Rename',
                        type: 'rename',
                        action: function (node) {
                        }

                    },
                    {
                        text: 'Delete',
                        type: 'delete',
                        action: function (node) {
                            scope.dispatchEvent({
                                type: 'IeecloudEditTreeRenderer.deleteNodeById', value: node.id
                            });
                        }
                    },
                    {
                        text: 'Edit',
                        type: 'edit',
                        action: function (node) {
                            scope.dispatchEvent({
                                type: 'IeecloudEditTreeRenderer.editNodeById', value: node.id
                            });
                        }
                    }
                ]
            }
        }
    }

    generateTemplate() {
        return ` <div class="tree-edit-content">
       <div class="tree-edit-structure" id="treeEditFinalContainer">
           <div id="inspire-tree-edit-view"></div>
        </div></div>  
        <div class="modal fade" id="editCreateNodesModal-` + this.#node.id + `" tabindex="-1" aria-labelledby="edit2dNodesModal" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Свойства ноды</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <div id="Form1"></div>
                </div>
            </div>
        </div>
    </div>`;
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());

        scope.#viewTreeEditInstance = new IeecloudMyTreeInspireView('inspire-tree-edit-view',
            scope.#contextMenu, {readOnly: false, scrollAutoToActive: false, scrollOptions: {behavior: "smooth"}});

        scope.#formBuilderInstance = new IeecloudFormBuilder({asDialog: false});

        const modalElement = document.getElementById("editCreateNodesModal-" + this.#node.id);
        scope.#nodeModal = new Modal(modalElement);
    }

    renderTree(tree) {
        const scope = this;
        scope.#viewTreeEditInstance.redrawTreeView(tree);
    }

    hideModal(){
        this.#formBuilderInstance.removeAllListeners(); // do we really need this?
        this.#nodeModal.hide();
    }

    doEditNode(editedNodeId, nodeProps){
        const scope = this;
        scope.#formBuilderInstance.create("Form1", nodeProps, "Form1");
        scope.#nodeModal?.show();
        scope.#formBuilderInstance.on('formBuilder.submitValues', function (properties) {
            console.log(properties)
            scope.dispatchEvent({
                type: 'IeecloudEditTreeRenderer.updateNode', value: {
                    nodeId: editedNodeId,
                    properties: properties
                }
            });
        });
        scope.#formBuilderInstance.on('formBuilder.cancelFrom', function () {
            scope.hideModal();
        });
    }

}