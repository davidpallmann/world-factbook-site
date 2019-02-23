exports.handler = function(event, context, callback) {

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 
    
    var corsHeaders = {
                        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
                    };

    var testing = false;

    var term = null;

    if (testing) {
        term = 'island';
    }
    else {
        try {
            term = event.queryStringParameters.term;
        }
        catch(e) { }
    }
    
    if (term===null || term===undefined || term==='') {
        callback(null, { statusCode: 400, headers: corsHeaders, body: 'Missing parameter: term' });
        return;
    }

    var params = {
      TableName: 'factbook',
      ExpressionAttributeNames: {
         '#key': 'key',
         '#name': 'name',
         '#source': 'source'
      },
      ExpressionAttributeValues: {
        ':term': term,
        ':source': 'Factbook'
      },
      KeyConditionExpression: '#source = :source',
      FilterExpression: 'contains(#key, :term) or contains(introduction.background, :term) or contains(geography.climate, :term) or contains(geography.terrain, :term) or contains(people.demographic_profile, :term) or contains(economy.overview, :term) or contains(geography.map_reference, :term) or contains(government.government_type, :term) or contains(transnational_issues.disputes[0], :term)',
      ProjectionExpression: '#name, #key'
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

