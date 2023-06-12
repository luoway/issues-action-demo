const path = require('path')
const fse = require('fs-extra')
const { getIssue } = require('./utils/gl-issue')
const { writeDoc, removeDoc } = require('./utils/write-doc')
const Sidebar = require('./utils/control-sidebar')

const targetDir = path.join(__dirname, '../docs')
const {
    number,
    action,
    labels,
    actionLabel,
    acceptLabels,
} = require('./utils/constants')

!(async function () {
    if(actionLabel && !acceptLabels.includes(actionLabel)) {
        console.log(`action label '${actionLabel}' not match acceptLabels: ${acceptLabels}`)
        return process.exit(1)
    }

    const label = actionLabel || labels.split(',').find(item => acceptLabels.includes(item))
    if(!label) {
        console.log('issue labels not match acceptLabels', labels)
        return process.exit(1)
    }

    if (['reopened', 'edited', 'labeled'].includes(action)) {
        console.log('add or update issue', number)

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

        if(issueData) {
            writeDoc(filePath, issueData)
            Sidebar.insert(issueData, label)
        }
    }else{
        console.log('remove issue', number)
        removeDoc(number)
        Sidebar.remove(number)
    }
})()