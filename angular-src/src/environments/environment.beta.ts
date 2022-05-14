export const environment = {
    production: false,
    baseUrl: 'https://thepartnershipconnectionapi-beta.azurewebsites.net',
    //baseUrl: 'https://thepartnershipconnectionapi-beta.azurewebsites.net',
    cmsUrl: 'https://thepartnershipconnectionapi-cms.azurewebsites.net',
    nmcUrl: 'https://thepartnershipconnectionapi-nmc.azurewebsites.net',
    appInsights: {
        instrumentationKey: '9e5cf497-b794-4e72-a1c6-603856eeda3b'
    },
    appVersion: require('../../../angular-src/package.json').version
}