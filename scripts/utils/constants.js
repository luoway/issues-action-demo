module.exports = {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repoName: process.env.GITHUB_REPO.split('/')[1],
    label: process.env.LABEL || 'deploy',
    pageSize: process.env.SIZE || 100,
    number: process.env.NUMBER,
}