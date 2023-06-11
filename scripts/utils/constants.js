module.exports = {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    label: process.env.LABEL || 'deploy',
    pageSize: process.env.SIZE || 999,
    number: process.env.NUMBER,
}