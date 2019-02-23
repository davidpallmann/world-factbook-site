// List top 10 countries with smallest area

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

var corsHeaders = { "Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Credentials" : true };

exports.handler = function(event, context, callback) {

    var params = {
      TableName: 'factbook',
      IndexName: 'rank-area-index',
      ExpressionAttributeNames: {
         '#name': 'name',
         '#source': 'source'
      },
      ExpressionAttributeValues: {
        ':source': 'Factbook',
      },
      KeyConditionExpression: '#source = :source',
      ProjectionType : "ALL",
      ProjectionExpression: "#name, global_rank_area, global_value_area",
      Limit: 10,
      ScanIndexForward: false
    };
    
    docClient.query(params, function(err, data) {

        if(err) { 
            console.log('03 err:')
            console.log(err.toString());
            callback(err, { statusCode: 500, headers: corsHeaders, body: 'Error: ${err}' });
        } else { 
            callback(null, {
                    headers: corsHeaders,
                    body: JSON.stringify(data.Items)
                });
        }
      });
};

