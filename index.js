'use strict';

const aws = require('aws-sdk');
const uuidv1 = require('uuid/v1');

const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const dynamodb_doc = new aws.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});

const s3 = new aws.S3();

const kms = new aws.KMS({'region': AWS_DEPLOY_REGION});
let environment = 'prod';
const params = {
  CiphertextBlob: fs.readFileSync(environment + "_config_encrypted.txt")
}

exports.handler = async (event, context) => {
	try {
		let data = await kms.decrypt(params).promise();
		
		let config = yaml.load(data['Plaintext'].toString());
		
		if (event.clickType) {
			let transaction_type = "directional_question"
		} else {
			let transaction_type = "reference_question"
		}
		var collection = {
  			  TableName: MESSAGES_TABLE,
  			  Item: {
  			    'transactionId': uuidv1(),
  			    'date': Date.now(),
  			    'question_type': transaction_type
  			    }
  			};
		try {
			let data = await dynamodb_doc.put(collection).promise()
		} catch (Error){
			console.log(Error, Error.stack);
		    return Error;
		}	
		
	} catch (Error){
		console.log(Error, Error.stack);
	    return Error;
	}       
};