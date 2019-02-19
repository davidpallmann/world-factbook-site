module.exports = function (context, req, countryList) {

    context.res = {
        body: countryList
    };
    context.done();
};