const commander = require('commander');
const path = require('path')
const fs = require('fs')
const download = require('download-git-repo')
const generator = require('../lib/generator')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const rm = require('rimraf').sync
const logSymbols = require('log-symbols')
const repo = 'github.com:Gordon-H/fabton-template-node'
const downloadPath = 'temp'

commander
    .option('-f, --file <path>', 'the config file')
    .parse(process.argv);

const folderNotEmpty = fs.readdirSync(process.cwd()).length > 0
const message = []

if (folderNotEmpty) {
    message.push({
        name: 'continue',
        message: 'Current folder is not empty, do you want to continue and overwrite the files?',
        type: 'confirm',
        default: false
    })
}

let next = inquirer.prompt(message).then(answer => {
    return Promise.resolve(answer)
})
next.then(answer => {
    if (!folderNotEmpty || (folderNotEmpty && answer.continue)) {
        initProject()
    }
})

function initProject(target) {
    target = path.join(target || '.', downloadPath)
    const spinner = ora(`Downloading template...`)
    spinner.start()
    download(repo, target, {clone: true}, (err) => {
        try {
            if (err) {
                spinner.fail()
                console.log(logSymbols.error, chalk.red(`Init failed, ${err.message}`))
            } else {
                renderTemplate(target, '.')
                spinner.succeed()
                console.log(logSymbols.success, chalk.green(`Init success!`))
            }
        } catch (e) {
            spinner.fail()
            console.log(logSymbols.error, chalk.red(`Init failed, ${e.message}`))
            rm(target)
        }
    })
}

function renderTemplate(src, dst) {
    let context
    console.log(commander.file)
    if (commander.file) {
        context = JSON.parse(fs.readFileSync(commander.file))
    } else {
        context = require('../default')
    }
    generator(context, src, dst)
}


