const path = require('path')
const fse = require('fs-extra')

const configPath = path.join(__dirname, '../../docs/.vitepress/config.js')

module.exports = {
    writeDoc(filePath, issueData){
        let configStr = fse.readFileSync(configPath, 'utf-8')
        if(configStr.search(`{ text: '${issueData.title}', link: '/${issueData.number}' },`) === -1){
            configStr = configStr.replace(/(sidebar:\s?\[)/, `$1\n{ text: '${issueData.title}', link: '/${issueData.number}' },`)
            fse.writeFileSync(configPath, configStr)
        }
        return fse.writeFile(filePath, `# ${issueData.title}\n${issueData.body}`)
    },
    removeDoc(number){
        let configStr = fse.readFileSync(configPath, 'utf-8')
        if(configStr.search(`link: '/${number}' },`) !== -1){
            configStr = configStr.replace(new RegExp(`{\s?text:\s?'.+?',\s?link:\s?'/${number}'\s?},`, 'g'),'')
            console.log(19, configStr)
            fse.writeFileSync(configPath, configStr)
        }
    }
}