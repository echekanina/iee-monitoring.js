// Importing express module
const express = require('express');
const fs = require("fs");
const cors = require('cors');
const app = express();

const request = require ('request');
const config = require('config');
const port = config.get('server.port');
const host = config.get('server.host');
const configFileSource = config.get('config_file_source');
const gitBaseUrl = config.get('git_config.base_url');
const gitToken = config.get('git_config.git_token');
const configFilesLocalBasePath = config.get('config_files_local_base_path');

let options = {
    headers: {
        'Authorization': 'token ' + gitToken
    }
}

app.use(express.json({limit: '150mb'}));

app.use(cors({
    origin: '*'
}));

app.post('/read-file', (req, res) => {
    const orgCode = req.body.orgCode;
    const appType = req.body.appType;
    const appCode = req.body.appCode;
    const env = req.body.env;
    const fileName = req.body.fileName;
    if (configFileSource === "git") {
        options.url = gitBaseUrl + orgCode + "/" + appType + "/"  + env + "/" + appCode + "/"  + fileName;
        request (options, (error, response, body) => {
            !error && response.statusCode === 200
                ? res.send(body)
                : console.log (error)
        })
    } else  if (configFileSource === "local"){
        const localPath = configFilesLocalBasePath + orgCode + "/" + appType + "/"  + env + "/" + appCode + "/"  + fileName;
        const data = fs.readFileSync(localPath, 'utf8');
        res.send(data);
    }
});

app.post('/save-tree', (req, res) => {
    const fileName = req.body.fileName;
    if (configFileSource === "git") {
        console.log(`Cannot save file ${fileName}: in config_file_source ${configFileSource}. Change to local`);
        return;
    }
    const orgCode = req.body.orgCode;
    const appType = req.body.appType;
    const appCode = req.body.appCode;
    const env = req.body.env;

    const localPath = configFilesLocalBasePath + orgCode + "/" + appType + "/"  + env + "/" + appCode + "/"  + fileName;
    fs.writeFile(localPath, JSON.stringify(req.body.data) , 'utf8', function(err) {
        if (err) {
            console.log(err);
        }
        console.log('complete');
    });

    res.end('{"msg": "OK"}');
});

app.post('/schemas', (req, res) => {
    if (configFileSource === "git") {
        console.log(`Cannot get list of schemes in ${configFileSource}. Change to local`);
        return;
    }
    const orgCode = req.body.orgCode;
    const appType = req.body.appType;
    const env = req.body.env;
    const path = configFilesLocalBasePath + orgCode + "/" + appType + "/"  + env  + "/schemas/";
    const files = fs.readdirSync(path);
    res.end(JSON.stringify(files));
});

const server = app.listen(port, host, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server is running on ${host}:${server.address().port}`);
});