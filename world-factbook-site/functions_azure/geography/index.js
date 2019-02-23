// Function: geography - returns the geography section of a Country document
// Inputs: country - country name (example: Algeria)
// Outputs: people JSON

module.exports = function (context, req, countryList) {

    if (!countryList || countryList.length===0)
    {
        context.log("Country item not found");

        context.res = {
                status: 400
        };
        context.done();
    }
    else
    {
        context.log("Found Country item, name=" + countryList[0].name);

        context.res = {
                body: countryList[0].geography
        };
        context.done();
    }

};