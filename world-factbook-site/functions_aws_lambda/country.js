exports.handler = function(event, context, callback) {

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 
    
    var corsHeaders = {
                            "Access-Control-Allow-Origin" : "*",
                            "Access-Control-Allow-Credentials" : true
                    };

    var countryName = null;
    
    if (event && event.queryStringParameters && event.queryStringParameters.name) countryName = event.queryStringParameters.name;
    
    if (!countryName) {
        callback(null, { statusCode: 200, headers: corsHeaders, body: 'Missing parameter: name' });
    }

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
    };
    
    docClient.query(params, function(err, data) {

    if(err) { 
        console.log('03 err:')
        console.log(err.toString());
        callback(err, { statusCode: 500, headers: corsHeaders, body: 'Error: ${err}' });
    } else { 
        if (!data || data.Items.length===0) {
            callback(null, { statusCode: 400, headers: corsHeaders, body: 'Country not found: ' + countryName });
        }
        else {
            callback(null, {
                    headers: corsHeaders,
                    body: JSON.stringify(data.Items[0])
                });
        }
    }
  });
};

