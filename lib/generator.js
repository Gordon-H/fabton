// npm i handlebars metalsmith -D
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

module.exports = function (metadata = {}, src, dest = '.') {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }
    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(true)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                Handlebars.registerHelper("camelize", camelize)
                Object.keys(files).forEach(fileName => {
                    const t = files[fileName].contents.toString()
                    if (fileName.startsWith('contract/lib/item')) {
                        let items = meta.models
                        delete files[fileName]
                        items.forEach((item) => {
                            const f = {contents: new Buffer(Handlebars.compile(t)(item))}
                            if (fileName.endsWith("List.js")) {
                                files['contract/lib/' + camelize(item.name) + "List.js"] = f
                            } else {
                                files['contract/lib/' + camelize(item.name) + ".js"] = f
                            }
                        })
                    } else {
                        files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
                    }
                })
                done()
            }).build(err => {
            rm(src)
            err ? reject(err) : resolve()
        })
    })
}
