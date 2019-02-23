// Function: geography - returns the geography section of a Country document
// Inputs: country - country key (example: algeria)
// Outputs: country JSON, or status 400 if not found

module.exports = function (context, req, countryList) {

    if (!countryList || countryList.length===0)
    {
        context.log("Country not found");

        context.res = {
                status: 400
        };
        context.done();
    }
    else
    {
        context.log("Found Country, name=" + countryList[0].name);

        context.res = {
                body: countryList[0]
        };
        context.done();
    }


};