// cloud.js - defines the cloud platform-specific values for the site

var cloud = {
    platform: 'aws',
    poweredBy: 'Powered by AWS Lambda &amp; DynamoDB<br/> Data courtesy of & nbsp; <a href="https://www.cia.gov/library/publications/the-world-factbook/" target="_blank">CIA WorldFactbook</a>',
    resultToJson: function (response) {  // perform any conversion necessary of function response to a JSON variable
        return response;
    },
    flagImageUrl: function (countryKey) {
        return 'https://s3.amazonaws.com/factbook-data/' + countryKey + '.gif';
    },
    mapImageUrl: function (countryKey) {
        return 'https://s3.amazonaws.com/factbook-data/' + countryKey + '-map.gif';
    },
    countryRecordUrl: function (countryName, countryKey) {
        return 'https://5qx7ki4dij.execute-api.us-east-1.amazonaws.com/default/country?name=' + replace(countryName, ' ', '+');
    },
    searchUrl: function (term) {
        return 'https://5qx7ki4dij.execute-api.us-east-1.amazonaws.com/default/search?term=' + term;
    },
    reportUrl: function (reportId) {
        return 'https://5qx7ki4dij.execute-api.us-east-1.amazonaws.com/default/' + reportId;
    },
    columnChartAvailable: function (chartName) {    // returns true if chart name is supported/available
        switch (chartName) {
            case 'report-area-highest':
            case 'report-area-lowest':
            case 'report-exports-highest':
            case 'report-exports-lowest':
            case 'report-imports-highest':
            case 'report-imports-lowest':
            case 'report-inflation-highest':
            case 'report-inflation-lowest':
            case 'report-internet-users-highest':
            case 'report-population-highest':
            case 'report-population-lowest':
                return true;
            default:
                return false;
        }
    },

    // Interpret report data and format for a Google Charts column chart
    // inputs: chartName, chartData (raw JSON chart data from function).
    // outputs: Sets chartTitle, xAxisTitle, yAxisTitle/2/3. Pushes country name to countrySelect. Pushes value(s) to googleChartData.
    columnChartData: function (chartName, chartData) {

        xAxisTitle = null;
        yAxisTitle = null;
        yAxisTitle2 = null;
        yAxisTitle3 = null;
        reportId = null;
        var googleChartData = [];

        switch (chartName) {
            case 'report-area-highest':
                chartTitle = 'Area - Largest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Area (sq km)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Land';
                    yAxisTitle3 = 'Water';
                }
                reportId = 'report-area-highest';
                if (chartData != null) {
                    var country = null;
                    var land = 0;
                    var water = 0;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);

                        land = 0;
                        water = 0;

                        googleChartData.push([
                            { v: country.name }, country.global_value_area
                        ]);
                    }
                }
                break;
            case 'report-area-lowest':
                chartTitle = 'Area - Smallest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Area (sq km)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Land';
                    yAxisTitle3 = 'Water';
                }
                reportId = 'report-area-lowest';
                if (chartData != null) {
                    var country = null;
                    var land = 0;
                    var water = 0;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);

                        land = 0;
                        water = 0;

                        googleChartData.push([
                            { v: country.name }, country.global_value_area
                        ]);
                    }
                }
                break;
            case 'report-exports-highest':
                chartTitle = 'Exports - Highest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Exports (USD)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                }
                reportId = 'report-exports-highest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        var n1, n2;
                        n1 = country.global_value_exports;
                        googleChartData.push([
                            { v: country.name }, n1
                        ]);
                    }
                }
                break;
            case 'report-exports-lowest':
                chartTitle = 'Exports - Lowest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Exports (USD)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                }
                reportId = 'report-exports-lowest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        var n1, n2;
                        n1 = country.global_value_exports;
                        googleChartData.push([
                            { v: country.name }, n1
                        ]);
                    }
                }
                break;
            case 'report-imports-highest':
                chartTitle = 'Imports - Highest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Imports (USD)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                }
                reportId = 'report-imports-highest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        var n1, n2;
                        n1 = country.global_value_imports;
                        googleChartData.push([
                            { v: country.name }, n1
                        ]);
                    }
                }
                break;
            case 'report-imports-lowest':
                chartTitle = 'Imports - Lowest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Imports (USD)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                }
                reportId = 'report-imports-lowest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        var n1, n2;
                        n1 = country.global_value_imports;
                        googleChartData.push([
                            { v: country.name }, n1
                        ]);
                    }
                }
                break;
            case 'report-inflation-highest':
                chartTitle = 'Inflation - Highest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Inflation Rate';
                reportId = 'report-inflation-highest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        googleChartData.push([
                            { v: country.name }, country.global_value_inflation_rate
                        ]);
                    }
                }
                break;
            case 'report-inflation-lowest':
                chartTitle = 'Inflation - Lowest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Inflation Rate';
                reportId = 'report-inflation-lowest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        googleChartData.push([
                            { v: country.name }, country.global_value_inflation_rate
                        ]);
                    }
                }
                break;
            case 'report-internet-users-highest':
                chartTitle = 'Internet Users - Most';
                xAxisTitle = 'Country';
                yAxisTitle = 'No. Internet Users (Millions)';
                if (cloud.platform == 'azure') {
                    yAxisTitle2 = 'Percent of Populaton';
                }
                reportId = 'report-internet-users-highest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    var total = 0;
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        total = country.global_value_internet_users / 1000000;
                        googleChartData.push([
                            { v: country.name }, total
                        ]);
                    }
                }
                break;
            case 'report-population-highest':
                chartTitle = 'Population - Highest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Population';
                reportId = 'report-population-highest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        googleChartData.push([
                            { v: country.name }, country.global_value_population
                        ]);
                    }
                }
                break;
            case 'report-population-lowest':
                chartTitle = 'Population - Lowest';
                xAxisTitle = 'Country';
                yAxisTitle = 'Population';
                reportId = 'report-population-lowest';
                if (chartData != null) {
                    var country = null;
                    countrySelect = [];
                    for (var d = 0; d < chartData.length; d++) {
                        country = chartData[d];
                        countrySelect.push(country.name);
                        googleChartData.push([
                            { v: country.name }, country.global_value_population
                        ]);
                    }
                }
                break;
            default:
                console.log('chart not found: ' + chartName);
                break;
        }

        if (reportId) { return googleChartData; } else { return null; }
    },
};

