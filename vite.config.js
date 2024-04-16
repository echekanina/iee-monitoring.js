import {defineConfig} from 'vite';

import moment from "moment";
import importMetaEnv from "@import-meta-env/unplugin";
import {viteStaticCopy} from 'vite-plugin-static-copy'

const jsInjectConfig = (mode) => {
    return {
        name: "no-attribute",
        transformIndexHtml(html) {
            html = html.replace("<!-- # INSERT CONFIG SCRIPT HERE -->", '<script src="config.js?v=' + Date.now() + '"></script>')
            return html;
        }
    }
}

export default defineConfig(({command, mode, ssrBuild}) => {
    //
    if (command === 'serve') {
        return {
            plugins: [importMetaEnv.vite(
                {
                    example: ".env.example.public",
                    transformMode: "compile-time",
                    env: mode === "mock" ? ".env.public.mock" :
                        mode === "dev" ? ".env.public.dev" :
                            mode === "test" ? ".env.public.test" :
                                ".env"

                }
            )],
            // dev specific config
            define: {
                '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
                '__KEY_OPTIONS__': JSON.stringify(process.env.npm_package_version),
                '__BUILD_DATE__': JSON.stringify(moment(Date.now()).format('DD.MM.YYYY HH:mm'))
            }
        }
    } else {
        // command === 'build'
        return {
            plugins: [importMetaEnv.vite(
                {
                    example: ".env.example.public",
                    transformMode: "runtime"
                }
            ),
                viteStaticCopy({
                    targets: [
                        {
                            src: `config.${mode}.js`,
                            dest: '.',
                            rename: (name, extension, fullPath) => {
                                console.log("CONFIG", name)
                                return `config.${extension}`;
                            },/*
                            transform: (contents, filename) => {
                               console.log(contents)
                                return contents.toString();
                            }*/
                        }
                    ]
                }), jsInjectConfig()],
            // build specific config
            define: {
                '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
                '__KEY_OPTIONS__': JSON.stringify(process.env.npm_package_version + '_' + Date.now()),
                '__BUILD_DATE__': JSON.stringify(moment(Date.now()).format('DD.MM.YYYY HH:mm'))
            }
        }
    }
});