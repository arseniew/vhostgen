#! /usr/bin/env node

var
    commander = require('commander'),
    jsonfile = require('jsonfile'),
    metadata = jsonfile.readFileSync(__dirname + '/package.json'),
    fs = require('fs'),
    args,
    serverName,
    documentRoot,
    variables;

function fillTemplate(template, params) {
    var
        param,
        toReplace,
        result = template;

    for (param in params) {
        if (params.hasOwnProperty(param)) {
            toReplace = '{{' + param + '}}';
            result = result.replace(RegExp(toReplace, 'g'), params[param]);
        }
    }
    return result;
}

commander
    .usage('<ServerName> [DocumentRoot] [options]')
    .version(metadata.version)
    .option('-r, --webRoot <string>', 'Web Root [/var/www]', '/var/www')
    .option('-t, --templateName <string>', 'Template Name [default.conf]', 'default.conf');

commander.parse(process.argv);

args = commander.args;

variables = commander.opts();
serverName = args.shift();
documentRoot = args.shift() || commander.webRoot + '/' + serverName;

variables.serverName = serverName;
variables.documentRoot = documentRoot;

fs.readFile(__dirname + '/templates/' + commander.templateName, 'utf8', function (err, template) {
    if (err) {
        throw err;
    }
    console.log(fillTemplate(template, variables));
});

