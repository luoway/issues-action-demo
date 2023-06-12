const path = require('path')
const fse = require('fs-extra')

const sidebarPath = path.join(__dirname, '../../docs/.vitepress/sidebar.js')
const prefix = 'export default '

function genItem(issueData){
    console.log('genItem', issueData)
    if(issueData.node) issueData = issueData.node
    return { text: `${issueData.title}`, link: `/${issueData.number}` }
}
function genGroup(label){
    return {
        text: label,
        items: []
    }
}

function genSidebar(issues, labels){
    if(labels.length === 1){
        // 不显示分组
        return issues.filter(issue=>{
            return !issue.node.labels.nodes.includes(labels[0])
        }).map(genItem)
    }
    
    const labelMap = {}
    labels.forEach(label=>{
        labelMap[label] = genGroup(label)
    })
    issues.forEach(issue=>{
        issue.node.labels.nodes.some(label=>{
            const labelGroup = labelMap[label]
            if(!labelGroup) return false
            labelGroup.items.push(genItem(issue))
        })
    })
    return Object.values(labelMap)
}

function _writeFile(sidebar){
    fse.ensureFileSync(sidebarPath)
    fse.writeFileSync(sidebarPath, `${prefix}${JSON.stringify(sidebar)}`)
}


function read(){
    const str = fse.readFileSync(sidebarPath, 'utf-8')
    const newStr = str.replace(prefix, '')
    let sidebar = []
    try{
        sidebar = JSON.parse(newStr)
    }catch(e){
        console.error('JSON parse error.', e)
    }
    return sidebar
}

function write(issues, labels){
    console.log(58, issues, labels, genSidebar(issues, labels))
    _writeFile(genSidebar(issues, labels))
}

function insert(issueData, label){
    const sidebar = read()
    const list = label && sidebar.find(group=>group.text === label) || sidebar
    
    const foundIndex = list.findIndex(issue=>{
        const {link} = issue
        const num = parseInt(link.slice(1))
        if(num >= issueData.number){
            return true
        } 
    })

    if(foundIndex > -1) {
        let isReplace = 0
        if( sidebar[foundIndex].items[0].link.slice(1) === String(issueData.number) ) isReplace = 1
        sidebar.splice(foundIndex, isReplace, genItem(issueData))
    } else {
        sidebar.push(genItem(issueData))
    }

    _writeFile(sidebar)
}

function _remove(number, list){
    if(!list) list = read()

    if(list[0]?.link){
        const foundIndex = list.findIndex(item=>item.link.slice(1) === String(number))
        if(foundIndex > -1){
            list.splice(foundIndex, 1)
            return list
        }
    }else if(list[0]?.items){
        for(let group of list){
            if(_remove(number, group.items)){
                return list
            }
        }
    }
}

function remove(number){
    const sidebar = _remove(number)
    if(sidebar) _writeFile(sidebar)
}

module.exports = {
    read,
    write,
    insert,
    remove,
}