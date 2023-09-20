import {defineConfig} from 'vite';

import moment from "moment";
import importMetaEnv from "@import-meta-env/unplugin";

export default defineConfig(({command, mode, ssrBuild}) => {
    //
    if (command === 'serve') {
        console.log(mode)
        return {
            plugins: [importMetaEnv.vite(
                {
                    example: ".env.example.public",
                    transformMode: "compile-time",
                    env: mode === "izhora.mock" ? ".env.izhora.mock" :
                        mode === "ustluga.mock" ? ".env.ustluga.mock" :
                            mode === "izhora.development" ? ".env.izhora.development" :
                                mode === "ustluga.development" ? ".env.ustluga.development" :
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
                    transformMode: "runtime",
                    env: mode === "izhora.development" ? ".env.izhora.development" :
                                mode === "ustluga.development" ? ".env.ustluga.development" :
                                    mode === "izhora.test" ? ".env.izhora.test" :
                                        mode === "ustluga.test" ? ".env.ustluga.test" :
                                            mode === "izhora.prod" ? ".env.izhora.prod" :
                                                mode === "ustluga.prod" ? ".env.ustluga.prod" :
                                                    ".env"
                }
            )],
            // build specific config
            define: {
                '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
                '__KEY_OPTIONS__': JSON.stringify(process.env.npm_package_version + '_' + Date.now()),
                '__BUILD_DATE__': JSON.stringify(moment(Date.now()).format('DD.MM.YYYY HH:mm'))
            }
        }
    }
});