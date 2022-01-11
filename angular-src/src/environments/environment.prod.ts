export const environment = {
  production: true,
  //baseUrl: 'https://thepartnershipconnectionapi.azurewebsites.net',
  baseUrl: 'https://thepartnershipconnectionapi-staging.azurewebsites.net',
  appInsights: {
    instrumentationKey: '9e5cf497-b794-4e72-a1c6-603856eeda3b'
  },
  appVersion: require('../../../angular-src/package.json').version
};
