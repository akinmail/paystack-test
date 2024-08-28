const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

module.exports = AWSMock;
