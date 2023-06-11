const path = require('path')
const fse = require('fs-extra')
const { getIssues } = require('./utils/gl-issues-list')
const { getIssue } = require('./utils/gl-issue')
const { writeDoc } = require('./utils/write-doc')

const targetDir = path.join(__dirname, '../docs')

!(async function () {
    let issues = []
    try{
        issues = await getIssues()
    }catch(e){
        console.error(e)
        throw new Error('get issues fail.')
    }

    issues.forEach(async item=>{
        const node = item.node
        const filePath = path.join(targetDir, `${node.number}.md`)
        const p1 = fse.ensureFile(filePath)
        const p2 = getIssue(node.number)
        await p1
        const issueData = await p2
        writeDoc(filePath, issueData)
    })
})()
