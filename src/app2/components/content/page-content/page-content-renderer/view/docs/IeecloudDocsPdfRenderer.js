
import * as pdfjs from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import {range} from "lodash-es";
// TODO: use local file
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = `./vendor/pdf.worker.mjs`;
export default class IeecloudDocsPdfRenderer {
    #node;
    #container;

    constructor(node) {
        this.#node = node;
    }

    generateTemplate() {
        return `<div id="wrapper-pdf-${this.#node.id}"></div>`;
    }

    destroy()
    {
        const scope = this;
        if (scope.#container) {
            scope.#container.innerHTML = '';
        }
    }

    render(container) {
        const scope = this;
        scope.#container = container;
        scope.#container.innerHTML = '';
        scope.#container.insertAdjacentHTML('beforeend', scope.generateTemplate());

        const pdfPath = import.meta.env.APP_STATIC_STORAGE + "/" + this.#node.properties.path;



        let loadingTask = pdfjs.getDocument(pdfPath);
        loadingTask.promise.then(function(pdf) {
            let pagePromises = range(1, pdf.numPages).map(function(number) {
                return pdf.getPage(number);
            });
            return Promise.all(pagePromises);
        }).then(function(pages) {
                let scale = 1.5;
                let canvases = pages.forEach(function(page) {
                    let viewport = page.getViewport({ scale: scale, }); // Prepare canvas using PDF page dimensions

                    let canvas = document.createElement('canvas');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width; // Render PDF page into canvas context

                    let canvasContext = canvas.getContext('2d');
                    let renderContext = {
                        canvasContext: canvasContext,
                        viewport: viewport
                    };
                    page.render(renderContext).promise.then(function() {

                    });
                    document.getElementById('wrapper-pdf-' + scope.#node.id).appendChild(canvas);
                });
            },
            function(error) {
                return console.log('Error', error);
            });


    }
}