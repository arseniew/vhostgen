#! /usr/bin/env node

var maker = require('maker').createMaker();
var commander = require('commander');
var jsonfile = require('jsonfile');
var metadata = jsonfile.readFileSync(__dirname + '/package.json');
var fs = require('fs');

var requiredFlags = ['serverName', 'documentRoot'];
commander
    .version(metadata.version)
    .option('-s, --serverName <string>', 'Apache ServerName')
    .option('-d, --documentRoot <string>', 'Apache DocumentRoot')
    .option('-t, --templateFile <string>', 'Template Name [default.conf]', 'default.conf')
    .parse(process.argv);

/* Making sure required flags are specified, otherwise end with error */
requiredFlags.forEach(function (flagName) {
    if (commander[flagName] === undefined) {
        console.error('--' + flagName + ' is required.');
        process.exit(1);
    }
});

/* Rendering output from template and flags */
var filename = __dirname + '/templates/' + commander.templateFile;
var template = maker.makeTemplate(filename, {});
var filled = maker.fillTemplate(template, commander.opts());
var output = maker.renderTemplateToString(filled);
console.log(output);