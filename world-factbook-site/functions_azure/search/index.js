// Function: search - returns names and keys of country records containing search term
// Inputs: term - search word
// Outputs: array of objects with name and key properties. May be 0-length if no matches.

module.exports = function (context, req, countryList) {

    if (!countryList)
    {
        context.log("No matches");
        context.res = {
            body: []
        };
        context.done();
    }
    else
    {
        context.log("Found Country items, count=" + countryList.length.toString());

        context.res = {
            body: countryList
        };
        context.done();
    }

};