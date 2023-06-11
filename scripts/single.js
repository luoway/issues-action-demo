const path = require('path')
const fse = require('fs-extra')
const { getIssue } = require('./utils/gl-issue')
const { writeDoc, removeDoc } = require('./utils/write-doc')

const targetDir = path.join(__dirname, '../docs')
const {
    number,
    label,
    labels,
} = require('./utils/constants')

!(async function () {
    console.log(labels, label)
    if (labels.includes(label)) {
        // add label
        const filePath = path.join(targetDir, `${number}.md`)
        const p1 = fse.ensureFile(filePath)
        const p2 = getIssue(number)
        await p1
        let issueData
        try {
            issueData = await p2
        }catch(e){
            console.error(e)
            throw new Error('get issue fail.')
        }
        if(issueData) writeDoc(filePath, issueData)
    }else{
        // remove label
        removeDoc(number)
    }
})()