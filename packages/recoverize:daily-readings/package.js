Package.describe({
  name: 'recoverize:daily-readings',
  summary: 'Package to load the daily readings',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles('recoverize:daily-readings.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('recoverize:daily-readings');
  api.addFiles('recoverize:daily-readings-tests.js');
});
