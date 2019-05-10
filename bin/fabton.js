#! /usr/bin/env node
const commander = require('commander');

commander.version('0.1.0')
    .command('init', 'init a fabton project')
    .option('-f, --file', 'the config file', 'default.json')
    .option('-n, --name', 'the project name')
    .option('-v, --version', 'fabric version(default 1.4.1)')
    .parse(process.argv);


