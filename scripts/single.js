const path = require('path')
const fse = require('fs-extra')
const { getIssue } = require('./utils/gl-issue')
const { writeDoc } = require('./utils/write-doc')

const targetDir = path.join(__dirname, '../docs')
const {number: targetNumber} = require('./constants')

!(async function () {
    const filePath = path.join(targetDir, `${targetNumber}.md`)
    const p1 = fse.ensureFile(filePath)
    const p2 = getIssue(targetNumber)
    await p1
    let issueData
    try {
        issueData = await p2
    }catch(e){
        throw new Error('get issue fail.')
    }
    if(issueData) writeDoc(filePath, issueData)
})()