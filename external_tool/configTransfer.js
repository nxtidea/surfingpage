const { readFileSync, writeFileSync } = require('fs');

const file = readFileSync('./config-20240331-004225.json')

let oldConfig = JSON.parse(file);

let newConfig = {
    ...oldConfig,
    sites: oldConfig.sites.map(site => {
        let newSite = {
            ...site
        }
        if (newSite.favorite) {
            newSite.tags.push('收藏')
        }
        delete newSite.favorite
        
        newSite['createdAt'] = new Date().toISOString() + Math.random()
        return newSite
    })
}

writeFileSync('./output.json', JSON.stringify(newConfig, null, 2))