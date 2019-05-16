#! /usr/bin/env node
const commander = require('commander');

commander.version('0.1.0')
    .description('a scaffold tool for building Hyperledger Fabric project.')
    .command('init', 'init a fabton project')
    .parse(process.argv);
