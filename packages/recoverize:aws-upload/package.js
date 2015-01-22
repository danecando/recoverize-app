Package.describe({
  name: 'recoverize:aws-upload',
  summary: 'Package for uploading files to the app S3 bucket',
  version: '1.0.0'
});

Cordova.depends({
  'org.apache.cordova.file-transfer': '0.4.8'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1')

  api.addFiles('aws-upload.js')

  api.addFiles('upload.js', 'client')
  api.addFiles('sign.js', 'server')

  api.export('AwsUpload')
});