const path = require('path')
const fse = require('fs-extra')

const sidebarPath = path.join(__dirname, '../../docs/.vitepress/sidebar.js')
const prefix = 'export default '

function genItem(issueData){
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
        for(let label of issue.node.labels.nodes){
            const labelGroup = labelMap[label.name]
            if(!labelGroup) continue
            labelGroup.items.push(genItem(issue))
        }
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
    const sidebar = genSidebar(issues, labels)
    _writeFile(sidebar)
}

function insert(issueData, label){
    console.log(64, issueData, label)
    const sidebar = read()
    let list = label && sidebar.find(group=>group.text === label) || sidebar
    if(list.items) list = list.items
    console.log(68, list, sidebar)
    const foundIndex = list.findIndex(issue=>{
        console.log(issue)
        const {link} = issue
        const num = parseInt(link.slice(1))
        if(num >= issueData.number){
            return true
        } 
    })
    console.log(77, foundIndex)
    if(foundIndex > -1) {
        let isReplace = 0
        if( list[foundIndex].link.slice(1) === String(issueData.number) ) isReplace = 1
        console.log(list[foundIndex].link.slice(1), issueData.number, isReplace)
        list.splice(foundIndex, isReplace, genItem(issueData))
    } else {
        list.push(genItem(issueData))
    }
    console.log(85, sidebar)
    _writeFile(sidebar)
}

function _remove(number, label, list){
    if(!list) list = read()

    if(list[0]?.link){
        const foundIndex = list.findIndex(item=>item.link.slice(1) === String(number))
        if(foundIndex > -1){
            list.splice(foundIndex, 1)
            return list
        }
    }else if(list[0]?.items){
        for(let group of list){
            if(group.text === label) _remove(number, label, group.items)
        }
    }
    
    return list
}

function remove(number, label){
    const sidebar = _remove(number, label)
    _writeFile(sidebar)
    return sidebar
}

module.exports = {
    read,
    write,
    insert,
    remove,
}