import {defineConfig} from 'vite';

import moment from "moment";

export default defineConfig(({command, mode, ssrBuild}) => {
    if (command === 'serve') {
        return {
            // dev specific config
            define: {
                '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
                '__KEY_OPTIONS__':  JSON.stringify(process.env.npm_package_version),
                '__BUILD_DATE__': JSON.stringify(moment(Date.now()).format('DD.MM.YYYY HH:mm'))
            }
        }
    } else {
        // command === 'build'
        return {
            // build specific config
            define: {
                '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
                '__KEY_OPTIONS__': JSON.stringify(process.env.npm_package_version + '_' + Date.now()),
                '__BUILD_DATE__': JSON.stringify(moment(Date.now()).format('DD.MM.YYYY HH:mm'))
            }
        }
    }
});