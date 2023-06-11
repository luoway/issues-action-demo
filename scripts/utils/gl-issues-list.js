const {graphqlWithAuth} = require('./gl')

const {
    owner,
    repoName,
    label,
    pageSize,
} = require('./constants')

async function getIssues(){
    const { repository } = await graphqlWithAuth(`
        {
            repository(owner: "${owner}", name: "${repoName}") {
                issues(
                    orderBy: {
                        field: CREATED_AT, 
                        direction: DESC
                    }, 
                    labels: ${label ? [label] : null}, 
                    first: ${pageSize},
                ) {
                    edges {
                        node {
                            number
                            title
                            labels(first: 100) {
                                nodes {
                                    name
                                }
                            }
                            createdAt
                        }
                    }
                }
            }
        }
    `)

    return repository.issues.edges
}

module.exports = {
    getIssues
}