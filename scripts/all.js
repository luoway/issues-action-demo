const path = require('path')
const fse = require('fs-extra')
const { getIssues } = require('./utils/gl-issues-list')
const { getIssue } = require('./utils/gl-issue')
const { writeDoc } = require('./utils/write-doc')
const Sidebar = require('./utils/control-sidebar')

const targetDir = path.join(__dirname, '../docs')
const {
    acceptLabels,
} = require('./utils/constants')

!(async function () {
    let issues = []
    try{
        issues = await getIssues(acceptLabels)
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

    console.log(issues.map(item=>item.node.number))
    Sidebar.write(issues, acceptLabels)
})()
