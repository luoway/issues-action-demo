module.exports = {
    token: process.env.NODE_ENV.token,
    owner: process.env.NODE_ENV.owner,
    repoName: process.env.NODE_ENV.repository,
    label: process.env.NODE_ENV.label || 'deploy',
    pageSize: process.env.NODE_ENV.size || 999,
}