const fse = require('fs-extra')

module.exports = {
    writeDoc(filePath, issueData){
        return fse.writeFile(filePath, `# ${issueData.title}\n${issueData.body}`)
    },
}
