// load-country : load a country record
//
// This function retrieves a JSON country record for the specified key from S3, 
// and inserts a document into the factbook DynamoDB table.

// inputs:
//     key parameter: country key, such as "united_states"
//     https://s3.amazonaws.com/factbook-data/*.json must exist

const http = require('http');

exports.handler = function(event, context, callback) {

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

    // Get country key from HTTP query parameter.

    var key = null;
    
    if (event.queryStringParameters && event.queryStringParameters && event.queryStringParameters.key) {
        key = event.queryStringParameters.key;
    }
    
    //key = "austria"; // test
    //key = "antigua_and_barbuda";  // <= for in-portal testing

    // Retrieve <country>.json from s3

    var url = 'http://s3.amazonaws.com/factbook-data/' + key + '.json';
    console.log("01 http.get " + url);

    return http.get(url, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            
            // replace empty strings ("") with null because DynamoDB disallowes empty strings
            
            body = replace(body, 'type: ""', 'type: null');
            body = replace(body, '"type": ""', '"type": null');
            body = replace(body, 'name_alternative: ""', 'name_alternative": null');
            body = replace(body, '"name_alternative": ""', '"name_alternative": null');
            body = replace(body, 'note: ""', 'note: null');
            body = replace(body, '"note": ""', '"note": null');
            body = replace(body, 'foreign_based: ""', 'foreign_based: null');
            body = replace(body, '"foreign_based": ""', '"foreign_based": null');

            // parse body text into a JSON object
            
            var data = null;
            try {
                data = JSON.parse(body);
                //console.log(data.name);
            }
            catch(e) {
                console.log('03-A exception in JSON.parse: ' + e.toString());
                console.log(body);
            }
            
            if (data != null) 
            {
                // add 3 fields to the document
                
                data.key = key; // countryKey(data.name);
                data.timestamp = 'Monday, February 11, 2019 4:09:28 PM';
                data.source = 'Factbook';
                
                // promote fields to top that we need to index on
                
                if (data.geography && data.geography.area && data.geography.area.global_rank) {
                    data.global_rank_area = data.geography.area.global_rank; }
                if (data.people && data.people.population &&  data.people.population.global_rank) {
                    data.global_rank_population = data.people.population.global_rank; }
                if (data.economy && data.economy.imports && data.economy.imports.total_value && data.economy.imports.total_value.global_rank)
                    data.global_rank_imports = data.economy.imports.total_value.global_rank;
                if (data.economy && data.economy.exports && data.economy.exports.total_value && data.economy.exports.total_value.global_rank)
                    data.global_rank_exports = data.economy.exports.total_value.global_rank;
                if (data.economy && data.economy.inflation_rate && data.economy.inflation_rate.global_rank)
                    data.global_rank_inflation_rate = data.economy.inflation_rate.global_rank;
                if (data.communications && data.communications.internet && data.communications.internet.users && data.communications.internet.users.global_rank)
                    data.global_rank_internet_users = data.communications.internet.users.global_rank;
                if (data.geography && data.geography.area && data.geography.area.total && data.geography.area.total.value)
                    data.global_value_area = data.geography.area.total.value;
                if (data.people && data.people.population &&  data.people.population.total)
                    data.global_value_population = data.people.population.total;
                if (data.economy && data.economy.imports && data.economy.imports.total_value && data.economy.imports.total_value.annual_values && data.economy.imports.total_value.annual_values[0] && data.economy.imports.total_value.annual_values[0].value)
                    data.global_value_imports = data.economy.imports.total_value.annual_values[0].value;
                if (data.economy && data.economy.exports && data.economy.exports.total_value && data.economy.exports.total_value.annual_values && data.economy.exports.total_value.annual_values[0] && data.economy.exports.total_value.annual_values[0].value)
                    data.global_value_exports = data.economy.exports.total_value.annual_values[0].value;
                if (data.economy && data.economy.inflation_rate && data.economy.inflation_rate.annual_values && data.economy.inflation_rate.annual_values[0] && data.economy.inflation_rate.annual_values[0].value)
                    data.global_value_inflation_rate = data.economy.inflation_rate.annual_values[0].value;
                if (data.communications && data.communications.internet && data.communications.internet.users && data.communications.internet.users.total)
                    data.global_value_internet_users = data.communications.internet.users.total
                
                // insert country record
                
                var params = {
                    TableName: 'factbook',
                    Item: data
                    };
    
                console.log("Adding new item...");
                docClient.put(params, function(err, data2) {
                    if (err) {
                        console.error("04 error inserting document. Error JSON:", JSON.stringify(err, null, 2));
                        context.done(err, {
                        'statusCode': 200,
                        'headers': { 'Content-Type': 'application/json' },
                        'body': 'Failed to add record'
                        });
                    } else {
                        console.log("05 document inserted - source | name: " + data.source + ' | ' + data.name);
                        context.done(null, {
                             'statusCode': 200,
                            'headers': { 'Content-Type': 'application/json' },
                            //'body': 'Added record ' + data.name //JSON.stringify(data)
                            'body': JSON.stringify(data)
                        });
                    }
                });
            }
            else {
                 context.done(null, {
                             'statusCode': 200,
                            'headers': { 'Content-Type': 'application/json' },
                            'body': 'Failed to add record due to JSON parse error ' //JSON.stringify(data)
                        });
            }
        });
    }).on('error', function(err) {
        // handle errors with the request itself
        console.error('04 Error with the request:', err.message);
        callback(err);
    });


};

// ---- countryKey : generate a country key from a country name

function countryKey(countryName) {
    var countryKey = countryName.toLowerCase();
    countryKey = replace(countryKey, ' ', '_');
    countryKey = replace(countryKey, '-', '_');
    countryKey = replace(countryKey, '(', '');
    countryKey = replace(countryKey, ')', '');
    countryKey = replace(countryKey, ',', '');
    countryKey = replace(countryKey, "'", '');
    return countryKey;
}

function replace(value, oldChar, newChar) {
    if (!value) return null;
    return value.split(oldChar).join(newChar);
}
