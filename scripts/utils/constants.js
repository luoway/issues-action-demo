module.exports = {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repoName: process.env.GITHUB_REPO.split('/')[1],
    number: process.env.GITHUB_ISSUE_NUMBER,
    action: process.env.GITHUB_EVENT_ACTION,
    labels: process.env.GITHUB_ISSUE_LABELS,
    
    acceptLabels: ['deploy'], // 多于一项，则显示为侧边栏分组标题
}