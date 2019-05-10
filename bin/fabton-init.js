const commander = require('commander');
const path = require('path')
const fs = require('fs')
const download = require('download-git-repo')
const generator = require('../lib/generator')

const downloadPath = 'temp'
// const repo = 'git@github.com:Gordon-H/fabton-template-node.git#master'
// const repo = 'https://github.com:Gordon-H/mini-ledger.git#master'
const repo = 'github.com:Gordon-H/fabton-template-node'

commander.parse(process.argv);
// let projectName = commander.args[0]

fs.readdir(process.cwd(), function (err, files) {
    if (err) {
        console.log('some fatal error occurred when checking file!')
    } else {
        if (files.length) {
            console.log('current directory is not empty, please exec init in an empty directory')
            return
        }
    }
});


initProject().then(() => {
    console.log("finish init")
})

async function initProject() {
    await downloadTemplate()
    // await renderTemplate(src, 'dst')
}


async function downloadTemplate(target) {
    target = path.join(target || '.', downloadPath)
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download(repo, target, {clone: true}, (err) => {
        if (err) {
            console.log('fail')
            console.log(err)
        } else {
            renderTemplate(downloadPath, 'dst')
        }
    })
    return downloadPath
}

function renderTemplate(src, dst) {
    // 添加生成的逻辑
    // const context = {projectName: 'michael', list: ["aa", "bb"], items: [{name: 'name1', content: 'content1'}, {name: 'name2', content: 'content2'}]}
    const context = JSON.parse(fs.readFileSync('./default.json'))
    console.log('context = ' + JSON.stringify(context))
    try {
        generator(context, src, dst)
    } catch (e) {
        console.log('error')
        console.log(e)
    }

    // }).then(context => {
    //     console.log('创建成功:)')
    // }).catch(err => {
    //     console.error(`创建失败：${err.message}`)
    // })
}


