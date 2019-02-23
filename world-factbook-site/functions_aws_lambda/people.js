exports.handler = function(event, context, callback) {

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

    //var countryName = 'United States'
    var countryName = event["queryStringParameters"]['name'];

    var params = {
      TableName: 'factbook',
      ExpressionAttributeNames: {
         '#name': 'name',
         '#source': 'source'
      },
      ExpressionAttributeValues: {
        ':name': countryName,
        ':source': 'Factbook'
      },
      KeyConditionExpression: '#name = :name and #source = :source',
      ProjectionExpression: 'people'
    };
    
    docClient.query(params, function(err, data) {

    if(err) { 
        console.log('03 err:')
        console.log(err.toString());
        callback(err, { statusCode: 500, body: 'Error: ${err}' });
    } else { 
        if (!data || data.Items.length===0) {
            callback(err, { body: null });
        }
        else {
            callback(null, { body: JSON.stringify(data.Items[0]) });
        }
    }
  });
};

