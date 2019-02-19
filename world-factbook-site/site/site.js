        var inCountryView = false;
        var inChartView = false;
        var data = null;
        var googleChartData = null;
        var countrySelect = null;
        var chartTitle = null;
        var xAxisTitle = null;
        var yAxisTitle = null;
        var yAxisTitle2 = null;
        var yAxisTitle3 = null;

        $(document).ready(function () {
            $("#search-text").on("keyup", function (e) {
                if (e.keyCode == 13) {
                    search();
                }
            });

            $(".accordion").on("click", ".accordion-header", function () {
                $(this).toggleClass("active").next().slideToggle();
            });

            $(window).resize(function () {
                onResize();
            });
        });

        function onResize() {
            if (inChartView && googleChartData) {
                chartSelectionChanged();
            }
        }

        // Country selection changed - load and display country data

        function countrySelectionChanged() {
            $("body").css("cursor", "progress");
            $('#loading').css('visibility', 'visible');

            setCountryView();

            var countryName = $('#country').val();

            if (countryName === '') {
                setAllContent('No content');
                $('#preamble').removeClass('optional');
                $('h2').addClass('optional');
                $('#country-flag').css('visibility', 'collapse');
                $('#country-name').text('');
                $('#country-flag').attr('src', null);
                data = null;
                $("body").css("cursor", "default");
            }
            else {
                $('h2').removeClass('optional');
                var countryKey = CountryKey(countryName);

                setAllContent('Loading...');

                if (haveFlag(countryName)) {
                    $('#country-flag').attr('src', 'https://worldfactbook.blob.core.windows.net/data/' + countryKey + '.gif');
                    $('#country-flag').css('visibility', 'visible');
                }
                else {
                    $('#country-flag').css('visibility', 'collapse');
                    $('#country-flag').attr('src', null);
                }
                $('#country-name').text(countryName);

                // Retrieve JSON country record

                var url = 'https://factbook.azure-api.net/world-factbook/country/' + countryKey;

                $.ajax({
                    type: 'GET',
                    url: url,
                    accepts: "json",
                }).done(function (result) {
                    data = $.parseJSON(result);

                    if (data) {

                        // If nothing is open, open first accordion (Introduction)

                        if ($('.active').length === 0) {
                            $('#content-header-introduction').toggleClass("active").next().slideToggle();
                        }

                        // Load content: Introduction

                        var intro = '';
                        if (haveFlag(countryName)) {
                            intro = intro + '<div class="item"><b>Flag</b><br/><img class="content-image" src="https://worldfactbook.blob.core.windows.net/data/' + countryKey + '.gif"></div>';
                        }
                        if (data.introduction && data.introduction.background) {
                            intro += '<div class="item"><b>Background</b><br/>' + data.introduction.background + '</div>';
                        }
                        $('#content-introduction').html(intro);

                        // Load content: Geography

                        var geo = '';
                        geo = geo + '<div class="item"><b>Map</b><br/><a href="https://worldfactbook.blob.core.windows.net/data/' + countryKey + '-map.gif" target="_blank"><img class="content-image-large" src="https://worldfactbook.blob.core.windows.net/data/' + countryKey + '-map.gif"></a></div>';
                        if (data.geography) {
                            var geography = data.geography;
                            if (geography.geographic_coordinates && geography.geographic_coordinates.latitude) {
                                var lat = geography.geographic_coordinates.latitude.degrees + '&deg; ' + geography.geographic_coordinates.latitude.hemisphere;
                                var long = geography.geographic_coordinates.longitude.degrees + '&deg; ' + geography.geographic_coordinates.longitude.hemisphere;
                                geo += '<div class="item"><b>Coordinates</b><br/>' + lat + ', ' + long + '</div>';
                            }
                            if (geography.location) {
                                geo += '<div class="item"><b>Location</b><br/>' + geography.location + '</div>';
                            }
                            if (geography.climate) {
                                geo += '<div class="item"><b>Climate</b><br/>' + geography.climate + '</div>';
                            }
                            if (geography.terrain) {
                                geo += '<div class="item"><b>Terrain</b><br/>' + geography.terrain + '</div>';
                            }
                            if (geography.overview) {
                                geo += '<div class="item"><b>Overview</b><br/>' + geography.overview + '</div>';
                            }
                        }
                        $('#content-geography').html(geo);

                        // Load content: People

                        var people = '';
                        if (data.people) {
                            if (data.people.population && data.people.population.total) {
                                people += '<div class="item"><b>Population</b><br/>' + numberWithCommas(data.people.population.total) + '</div>';
                            }
                            if (data.people.populatione && data.people.population.rank) {
                                people += '<div class="item"><b>Global Rank</b><br/>' + data.people.population.global_rank + '</div>';
                            }
                            if (data.people.nationality && data.people.nationality.adjective) {
                                people += '<div class="item"><b>Nationality</b><br/>' + data.people.nationality.adjective + '</div>';
                            }
                            if (data.people.ethnic_groups && data.people.ethnic_groups.ethnicity) {
                                var ethnic_groups = data.people.ethnic_groups;
                                people += '<div class="item"><b>Ethnic Groups</b><br/>'
                                for (var i = 0; i < ethnic_groups.ethnicity.length; i++) {
                                    var pct = ethnic_groups.ethnicity[i].percent;
                                    var elem = ethnic_groups.ethnicity[i].name;
                                    var note = ethnic_groups.ethnicity[i].note;
                                    if (pct)
                                        elem += " (" + pct + '%)';
                                    if (note)
                                        elem += " note: " + note;
                                    if (i == 0)
                                        people += elem;
                                    else
                                        people += ", " + elem;
                                }
                                people += '</div>';
                            }
                            if (data.people.languages && data.people.languages.language) {
                                var languages = data.people.languages;
                                people += '<div class="item"><b>Languages</b><br/>'
                                for (var i = 0; i < languages.language.length; i++) {
                                    var pct = languages.language[i].percent;
                                    var elem = languages.language[i].name;
                                    if (pct)
                                        elem += " (" + pct + '%)';
                                    if (i == 0)
                                        people += elem;
                                    else
                                        people += ", " + elem;
                                }
                                people += '</div>';
                            }
                            if (data.people.religions && data.people.religions.religion) {
                                var religions = data.people.religions;
                                people += '<div class="item"><b>Religions</b><br/>'
                                for (var i = 0; i < religions.religion.length; i++) {
                                    var pct = religions.religion[i].percent;
                                    var elem = religions.religion[i].name;
                                    if (pct)
                                        elem += " (" + pct + '%)';
                                    if (i == 0)
                                        people += elem;
                                    else
                                        people += ", " + elem;
                                }
                                people += '</div>';
                            }
                            if (data.people.life_expectancy_at_birth && data.people.life_expectancy_at_birth.total_population && data.people.life_expectancy_at_birth.total_population.value && data.people.life_expectancy_at_birth.total_population.units) {
                                people += '<div class="item"><b>Life Expectancy at Birth</b><br/>' + data.people.life_expectancy_at_birth.total_population.value + ' ' + data.people.life_expectancy_at_birth.total_population.units + '</div>';
                            }
                            if (data.people.population_growth_rate && data.people.population_growth_rate.growth_rate && data.people.population_growth_rate.date) {
                                people += '<div class="item"><b>Population Growth Rate</b><br/>' + data.people.population_growth_rate.growth_rate + ' (' + data.people.population_growth_rate.date + ')</div>';
                            }
                            if (data.people.birth_rate && data.people.birth_rate.births_per_1000_population && data.people.birth_rate.date) {
                                people += '<div class="item"><b>Birth Rate</b><br/>' + data.people.birth_rate.births_per_1000_population + ' births per thousand (' + data.people.birth_rate.date + ')</div>';
                            }
                            if (data.people.death_rate && data.people.death_rate.deaths_per_1000_population && data.people.death_rate.date) {
                                people += '<div class="item"><b>Death Rate</b><br/>' + data.people.death_rate.deaths_per_1000_population + ' births per thousand (' + data.people.death_rate.date + ')</div>';
                            }
                        }
                        $('#content-people').html(people);

                        // Load content: Government

                        var govt = '';
                        if (data.government) {
                            var government = data.government;
                            if (government.government_type) {
                                govt += '<div class="item"><b>Type</b><br/>' + government.government_type + '</div>';
                            }
                            if (government.executive_branch && government.executive_branch.chief_of_state) {
                                govt += '<div class="item"><b>Chief of State</b><br/>' + government.executive_branch.chief_of_state + '</div>';
                            }
                            if (government.executive_branch && government.executive_branch.head_of_government) {
                                govt += '<div class="item"><b>Head of Government</b><br/>' + government.executive_branch.head_of_government + '</div>';
                            }
                            if (government.legal_system) {
                                govt += '<div class="item"><b>Legal System</b><br/>' + government.legal_system + '</div>';
                            }
                            if (government.capital && government.capital.name) {
                                govt += '<div class="item"><b>Capital</b><br/>' + government.capital.name + '</div>';
                            }
                            if (government.national_holidays) {
                                govt += '<div class="item"><b>National Holidays</b><br/>'
                                for (var i = 0; i < government.national_holidays.length; i++) {
                                    var elem = government.national_holidays[i].name + ' (' + government.national_holidays[i].day + ')';
                                    if (i == 0)
                                        govt += elem;
                                    else
                                        govt += ", " + elem;
                                }
                                govt += '</div>';
                            }
                            if (government.national_symbol && government.national_symbol.symbols && government.national_symbol.symbols[0].symbol) {
                                govt += '<div class="item"><b>National Symbol</b><br/>' + government.national_symbol.symbols[0].symbol + '</div>';
                            }
                            if (government.national_symbol && government.national_anthem.name) {
                                var anthem = '<b>National Anthem</b> <br />' + government.national_anthem.name;
                                if (government.national_anthem.audio_url) {
                                    anthem += ' <a href="' + government.national_anthem.audio_url + '" target="audio">Listen</a>';
                                }
                                govt += '<div class="item">' + anthem + '</div>';
                            }

                        }
                        $('#content-government').html(govt);

                        // Load content: Economy

                        var econ = '';
                        if (data.economy) {
                            var economy = data.economy;
                            if (economy.gdp && economy.gdp.official_exchange_rate && economy.gdp.official_exchange_rate.date && economy.gdp.official_exchange_rate.USD) {
                                econ += '<div class="item"><b>Gross Domestic Product</b><br/>' + economy.gdp.official_exchange_rate.date + ': ' + numberWithCommas(economy.gdp.official_exchange_rate.USD) + ' USD</div>';
                            }
                            if (economy.inflation_rate && economy.inflation_rate.annual_values && economy.inflation_rate.annual_values[0].value && economy.inflation_rate.annual_values[0].units && economy.inflation_rate.annual_values[0].date) {
                                econ += '<div class="item"><b>Inflation Rate</b><br/>' + economy.inflation_rate.annual_values[0].value + economy.inflation_rate.annual_values[0].units + ' (' + economy.inflation_rate.annual_values[0].date + ')</div>';
                            }
                            if (economy.exports && economy.imports.total_value && economy.imports.total_value.annual_values && economy.imports.total_value.annual_values[0]) {
                                econ += '<div class="item"><b>Imports</b><br/>' + numberWithCommas(economy.imports.total_value.annual_values[0].value) + ' ' + economy.imports.total_value.annual_values[0].units + ' (' + economy.exports.total_value.annual_values[0].date + ')</div>';
                            }
                            if (economy.exports && economy.exports.total_value && economy.exports.total_value.annual_values && economy.exports.total_value.annual_values[0]) {
                                econ += '<div class="item"><b>Exports</b><br/>' + numberWithCommas(economy.exports.total_value.annual_values[0].value) + ' ' + economy.exports.total_value.annual_values[0].units + ' (' + economy.exports.total_value.annual_values[0].date + ')</div>';
                            }
                            if (economy.agriculture_products && economy.agriculture_products.products) {
                                econ += '<div class="item"><b>Agricultural Products</b><br/>'
                                for (var i = 0; i < economy.agriculture_products.products.length; i++) {
                                    var elem = economy.agriculture_products.products[i];
                                    if (i == 0)
                                        econ += elem;
                                    else
                                        econ += ", " + elem;
                                }
                                econ += '</div>';
                            }
                            if (economy.industries && economy.industries.industries) {
                                econ += '<div class="item"><b>Industries</b><br/>'
                                for (var i = 0; i < economy.industries.industries.length; i++) {
                                    var elem = economy.industries.industries[i];
                                    if (i == 0)
                                        econ += elem;
                                    else
                                        econ += ", " + elem;
                                }
                                econ += '</div>';
                            }
                            if (economy.overview) {
                                econ += '<div class="item"><b>Overview</b><br/>' + economy.overview + '</div>';
                            }
                        }
                        $('#content-economy').html(econ);

                        // Load content: Energy

                        var energy = '';
                        if (data.energy) {
                            if (data.energy.electricity && data.energy.electricity.access && data.energy.electricity.access.total_electrification) {
                                energy += '<div class="item"><b>Total Electrification</b><br/>' + data.energy.electricity.access.total_electrification.value + '%</div>';
                            }
                            if (data.energy.crude_oil && data.energy.crude_oil.production && data.energy.crude_oil.production.bbl_per_day) {
                                energy += '<div class="item"><b>Crude Oil Production</b><br/>' + numberWithCommas(parseInt(data.energy.crude_oil.production.bbl_per_day)) + ' bbl/day</div>';
                            }
                            if (data.energy.refined_petroleum_products && data.energy.refined_petroleum_products.production && data.energy.refined_petroleum_products.production.bbl_per_day) {
                                energy += '<div class="item"><b>Refined Petroleum Production</b><br/>' + numberWithCommas(parseInt(data.energy.refined_petroleum_products.production.bbl_per_day)) + ' bbl/day</div>';
                            }
                            if (data.energy.natural_gas && data.energy.natural_gas.production.cubic_metres) {
                                energy += '<div class="item"><b>Natural Gas Production</b><br/>' + numberWithCommas(parseInt(data.energy.natural_gas.production.cubic_metres)) + ' cubic metres</div>';
                            }
                        }
                        $('#content-energy').html(energy);

                        // Load content: Communications

                        var comm = '';
                        if (data.communications) {
                            if (data.communications.telephones) {
                                var telephones = data.communications.telephones;
                                if (telephones && telephones.fixed_lines && telephones.fixed_lines.total_subscriptions) {
                                    comm += '<div class="item"><b>Telephone Fixed-line Subcriptions</b><br/>' + numberWithCommas(telephones.fixed_lines.total_subscriptions) + '</div>';
                                }
                                if (telephones.mobile_cellular && telephones.mobile_cellular.total_subscriptions) {
                                    comm += '<div class="item"><b>Mobile-Cellular Subcriptions</b><br/>' + numberWithCommas(telephones.mobile_cellular.total_subscriptions) + '</div>';
                                }
                            }
                            if (data.communications.broadcast_media) {
                                comm += '<div class="item"><b>Broadcast Media</b><br/>' + data.communications.broadcast_media + '</div>';
                            }
                            if (data.communications.internet) {
                                var internet = data.communications.internet;
                                if (internet.country_code) {
                                    comm += '<div class="item"><b>Internet Country Code</b><br/>' + internet.country_code + '</div>';
                                }
                                if (internet.users && internet.users.total && internet.users.percent_of_population) {
                                    comm += '<div class="item"><b>Internet Users</b><br/>' + numberWithCommas(internet.users.total) + ' (' + internet.users.percent_of_population + '%)</div>';
                                }
                            }
                        }
                        $('#content-communications').html(comm);

                        // Load content: Transportation

                        var trans = '';
                        if (data.transportation) {
                            if (data.transportation.air_transport && data.transportation.air_transport.national_system && data.transportation.air_transport.national_system.number_of_registered_air_carriers) {
                                trans += '<div class="item"><b>Registered Air Carriers</b><br/>' + numberWithCommas(data.transportation.air_transport.national_system.number_of_registered_air_carriers) + '</div>';
                            }
                            if (data.transportation.air_transport && data.transportation.air_transport.national_system && data.transportation.air_transport.national_system.inventory_of_registered_aircraft_operated_by_air_carriers) {
                                trans += '<div class="item"><b>Registered Air Carrier Aircraft</b><br/>' + numberWithCommas(data.transportation.air_transport.national_system.inventory_of_registered_aircraft_operated_by_air_carriers) + '</div>';
                            }
                            if (data.transportation.air_transport && data.transportation.air_transport.airports && data.transportation.air_transport.airports.total && data.transportation.air_transport.airports.total.airports) {
                                trans += '<div class="item"><b>Airports</b><br/>' + numberWithCommas(data.transportation.air_transport.airports.total.airports) + '</div>';
                            }
                            if (data.transportation.railways && data.transportation.railways.total && data.transportation.railways.total.length && data.transportation.railways.total.units) {
                                trans += '<div class="item"><b>Railways</b><br/>' + numberWithCommas(data.transportation.railways.total.length) + ' ' + data.transportation.railways.total.units + '</div>';
                            }
                            if (data.transportation.roadways && data.transportation.roadways.total && data.transportation.roadways.total.value && data.transportation.roadways.total.units) {
                                trans += '<div class="item"><b>Roadways</b><br/>' + numberWithCommas(data.transportation.roadways.total.value) + ' ' + data.transportation.roadways.total.units + '</div>';
                            }
                        }
                        $('#content-transportation').html(trans);

                        // Load content: Military and Security

                        var mil = '';
                        if (data.military_and_security) {
                            if (data.military_and_security.branches && data.military_and_security.branches.by_name) {
                                mil += '<div class="item"><b>Military Branches</b><br/>'
                                for (var i = 0; i < data.military_and_security.branches.by_name.length; i++) {
                                    var elem = data.military_and_security.branches.by_name[i];
                                    if (i == 0)
                                        mil += elem;
                                    else
                                        mil += "; " + elem;
                                }
                                mil += '</div>';
                            }
                            if (data.military_and_security.expenditures && data.military_and_security.expenditures.annual_values) {
                                var expenditures = data.military_and_security.expenditures;
                                mil += '<div class="item"><b>Annual Expenditures</b><br/>'
                                for (var i = 0; i < expenditures.annual_values.length; i++) {
                                    var value = numberWithCommas(expenditures.annual_values[i].value);
                                    var unit = expenditures.annual_values[i].units;
                                    if (unit === 'percent_of_gdp') {
                                        unit = '% GDP';
                                    }
                                    var elem = expenditures.annual_values[i].date + ': ' + value + ' ' + unit;
                                    if (i == 0)
                                        mil += elem;
                                    else
                                        mil += "<br/>" + elem;
                                }
                                mil += '</div>';
                            }
                        }
                        $('#content-military').html(mil);

                        // Load content: Transnational Issues

                        var transnat = '';
                        if (data.transnational_issues) {
                            if (data.transnational_issues.disputes) {
                                transnat += '<div class="item"><b>Disputes</b><br/>' + data.transnational_issues.disputes + '</div>';
                            }
                            if (data.transnational_issues.refugees_and_iternally_displaced_persons && data.transnational_issues.refugees_and_iternally_displaced_persons.refugees && data.transnational_issues.refugees_and_iternally_displaced_persons.refugees.by_country) {
                                transnat += '<div class="item"><b>Refugees by Country</b><br/>'
                                for (var i = 0; i < data.transnational_issues.refugees_and_iternally_displaced_persons.refugees.by_country.length; i++) {
                                    var elem = data.transnational_issues.refugees_and_iternally_displaced_persons.refugees.by_country[i].country_of_origin + ' : ' + numberWithCommas(data.transnational_issues.refugees_and_iternally_displaced_persons.refugees.by_country[i].people);
                                    transnat += elem + '<br/>';
                                }
                                if (data.transnational_issues.refugees_and_iternally_displaced_persons.refugees.by_country.length > 0) transnat += '<br/>';
                            }
                            if (data.transnational_issues.illicit_drugs && data.transnational_issues.illicit_drugs.note) {
                                transnat += '<div class="item"><b>Illicit Drugs</b><br/>' + data.transnational_issues.illicit_drugs.note + '</div>';
                            }
                        }
                        $('#content-transnational').html(transnat);

                        $('#loading').css('visibility', 'collapse');
                        $("body").css("cursor", "default");
                    }
                    else {
                        setAllContent('No content');
                    }
                });
            }
        }

        // Perform a search.

        function search() {

            var term = $('#search-text').val();
            if (!term) return;

            $("body").css("cursor", "progress");
            $('#loading').css('visibility', 'visible');

            $('#country').val('');
            $('#chart-select').val('');

            $('h2').removeClass('optional');

            $('#country-view').css('visibility', 'collapse');
            inCountryView = false;

            var url = 'https://factbook.azure-api.net/world-factbook/search/' + term;

            $.ajax({
                type: 'GET',
                url: url,
                accepts: "json",
            }).done(function (response) {

                var results = $.parseJSON(response);

                var html = '<table id="results-table" style="color: white; font-size: 20px">';
                var count = 0;
                var countryKey = null;
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        countryKey = CountryKey(results[i].name);
                        html += '<tr style="cursor: pointer; height: 24px; border-bottom: solid 1px white" onclick="selectCountry(' + "'" + results[i].name + "'" + ');">';
                        if (haveFlag(results[i].name)) {
                            html += '<td style="text-align: right"><img class="content-image-thumbnail" src="https://worldfactbook.blob.core.windows.net/data/' + countryKey + '.gif"></td>';
                        }
                        else {
                            html += '<td>&nbsp;</td>';
                        }
                        html += '<td>&nbsp;&nbsp;</td><td style="vertical-align: middle">' + results[i].name + '</td></tr>';
                        count++;
                    }
                }
                if (count == 0) {
                    html += '<tr><td>No matches</td></tr>';
                }
                html += '</table>';

                $('#results-list').html(html);
                $('#country-flag').css('visibility', 'collapse');
                $('#chart-view').css('visibility', 'collapse');
                $('#results-view').css('visibility', 'visible');

                $('#loading').css('visibility', 'collapse');
                $("body").css("cursor", "default");
            });
        }

        // Return to country view and auto-select a country

        function selectCountry(name) {
            $('#country').val(name).trigger('change');
            inCountryView = true;
        }

                // Ensure we are in country view and not chart view.

        function setCountryView() {
            if (!inCountryView) {
                $('#results-view').css('visibility', 'collapse');
                $('#chart-view').css('visibility', 'collapse');
                $('#country-view').css('visibility', 'visible');
                $('#select-chart').val('');
                inChartView = false;
                inCountryView = true;
            }
        }

        // Ensure we are in chart view and not country view.

        function setChartView() {
            if (!inChartView) {
                $('#country-flag').css('visibility', 'collapse');
                $('#country-view').css('visibility', 'collapse');
                $('#results-view').css('visibility', 'collapse');
                $('#chart-view').css('visibility', 'visible');
                inCountryView = false;
                inChartView = true;
            }
        }

        function setAllContent(content) {
            $('#country-flag').attr('src', content);
            $('#content-introduction').html(content);
            $('#content-geography').html(content);
            $('#content-people').html(content);
            $('#content-government').html(content);
            $('#content-economy').html(content);
            $('#content-energy').html(content);
            $('#content-communications').html(content);
            $('#content-transportation').html(content);
            $('#content-military').html(content);
            $('#content-transnational').html(content);
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function replace(value, oldChar, newChar) {
            if (!value) return null;
            return value.split(oldChar).join(newChar);
        }

        function CountryKey(countryName) {
            var countryKey = countryName.toLowerCase();
            countryKey = replace(countryKey, ' ', '_');
            countryKey = replace(countryKey, '-', '_');
            countryKey = replace(countryKey, '(', '');
            countryKey = replace(countryKey, ')', '');
            countryKey = replace(countryKey, ',', '');
            countryKey = replace(countryKey, "'", '');
            return countryKey;
        }

        function haveFlag(name) {
            switch (name) {
                case 'World':
                case 'Antarctica':
                case 'Arctic Ocean':
                case 'Atlantic Ocean':
                case 'Indian Ocean':
                case 'Pacific Ocean':
                case 'Paracel Islands':
                case 'Southern Ocean':
                    return false;
                default:
                    return true;
            }
        }

        function gotoChart() {

            // if chart selector is hidden, switch from search mode to chart mode

            if ($('#select-chart').css('visibility') === 'collapse') {
                setChartView();
                $('#search-text').css('visibility', 'collapse');
                $('#btn-search').css('visibility', 'collapse');
                $('#btn-goto-chart').css('display', 'none');
                $('#btn-goto-search').css('display', 'inline-block');
                $('#select-chart').css('visibility', 'visible');
            }
        }

        function gotoSearch() {

            // if chart selector is hidden, switch from search mode to chart mode

            if ($('#search-text').css('visibility') === 'collapse') {
                setCountryView();
                $('#select-chart').css('visibility', 'collapse');
                $('#btn-search').css('visibility', 'collapse');
                $('#btn-goto-search').css('display', 'none');
                $('#btn-goto-chart').css('display', 'inline-block');
                $('#search-text').css('visibility', 'visible');
                $('#btn-search').css('visibility', 'visible');
            }
        }

       // Chart selection changed - retrieve chart data and draw chart.

        function chartSelectionChanged() {
            var chartName = $('#select-chart').val();
            if (!chartName) {
                $('#chart_div').html('');
                return;
            }

            if (!inChartView) {
                setChartView();
            }

            $('#chart_div').html('');

            xAxisTitle = null;
            yAxisTitle = null;
            yAxisTitle2 = null;
            yAxisTitle3 = null;

            var reportId = null;
            var url = null;

            switch (chartName) {
                case 'area-highest':
                    chartTitle = 'Area - Largest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Area (sq km)';
                    yAxisTitle2 = 'Land';
                    yAxisTitle3 = 'Water';
                    reportId = 'report-area-highest';
                    break;
                case 'area-lowest':
                    chartTitle = 'Area - Smallest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Area (sq km)';
                    yAxisTitle2 = 'Land';
                    yAxisTitle3 = 'Water';
                    reportId = 'report-area-lowest';
                    break;
                case 'exports-highest':
                    chartTitle = 'Exports - Highest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Exports (USD)';
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                    reportId = 'report-exports-highest';
                    break;
                case 'exports-lowest':
                    chartTitle = 'Exports - Lowest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Exports (USD)';
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                    reportId = 'report-exports-lowest';
                    break;
                case 'imports-highest':
                    chartTitle = 'Imports - Highest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Imports (USD)';
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                    reportId = 'report-imports-highest';
                    break;
                case 'imports-lowest':
                    chartTitle = 'Imports - Lowest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Imports (USD)';
                    yAxisTitle2 = 'Prior Year Exports (USD)';
                    reportId = 'report-imports-lowest';
                    break;
                case 'inflation-highest':
                    chartTitle = 'Inflation - Highest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Inflation Rate';
                    reportId = 'report-inflation-highest';
                    break;
                case 'inflation-lowest':
                    chartTitle = 'Inflation - Lowest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Inflation Rate';
                    reportId = 'report-inflation-lowest';
                    break;
                case 'internet-users-highest':
                    chartTitle = 'Internet Users - Most';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'No. Internet Users (Millions)';
                    yAxisTitle2 = 'Percent of Populaton';
                    reportId = 'report-internet-users-highest';
                    break;
                case 'population-highest':
                    chartTitle = 'Population - Highest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Population';
                    reportId = 'report-population-highest';
                    break;
                case 'population-lowest':
                    chartTitle = 'Population - Lowest';
                    xAxisTitle = 'Country';
                    yAxisTitle = 'Population';
                    reportId = 'report-population-lowest';
                    break;
            }

            if (!reportId) {
                $('#chart_div').html('');
                return;
            }
            url = 'https://factbook.azure-api.net/world-factbook/' + reportId;


            $('#country').val('');

            $("body").css("cursor", "progress");
            $('#loading').css('visibility', 'visible');

            var chartData = null;
            $.ajax({
                type: 'GET',
                url: url,
                accepts: "json",
            }).done(function (result) {
                chartData = $.parseJSON(result);
                googleChartData = null;

                switch (chartName) {
                    case 'internet-users-highest':
                        googleChartData = [];
                        if (chartData != null) {
                            var country = null;
                            countrySelect = [];
                            var total = 0;
                            for (var d = 0; d < chartData.length; d++) {
                                country = chartData[d];
                                countrySelect.push(country.name);
                                total = country.total / 1000000;
                                googleChartData.push([
                                    { v: country.name }, total, country.percent_of_population
                                ]);
                            }
                        }
                        break;
                    case 'area-highest':
                    case 'area-lowest':
                        googleChartData = [];
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
                                if (country.land) land = country.land.value;
                                if (country.water) water = country.water.value;

                                googleChartData.push([
                                    { v: country.name }, country.total.value, land, water
                                ]);
                            }
                        }
                        break;
                    case 'exports-highest':
                    case 'exports-lowest':
                    case 'imports-highest':
                    case 'imports-lowest':
                        googleChartData = [];
                        if (chartData != null) {
                            var country = null;
                            countrySelect = [];
                            for (var d = 0; d < chartData.length; d++) {
                                country = chartData[d];
                                countrySelect.push(country.name);
                                var n1 = country["$1"].value;
                                var n2 =(country["$2"] ? country["$2"].value : null);
                                googleChartData.push([
                                    { v: country.name }, n1, n2
                                ]);
                            }
                        }
                        break;
                    case 'inflation-highest':
                    case 'inflation-lowest':
                        googleChartData = [];
                        if (chartData != null) {
                            var country = null;
                            countrySelect = [];
                            for (var d = 0; d < chartData.length; d++) {
                                country = chartData[d];
                                countrySelect.push(country.name);
                                googleChartData.push([
                                    { v: country.name }, country["$1"].value
                                ]);
                            }
                        }
                        break;
                    case 'population-highest':
                    case 'population-lowest':
                        googleChartData = [];
                        if (chartData != null) {
                            var country = null;
                            countrySelect = [];
                            for (var d = 0; d < chartData.length; d++) {
                                country = chartData[d];
                                countrySelect.push(country.name);
                                googleChartData.push([
                                    { v: country.name }, country.total
                                ]);
                            }
                        }
                        break;
                }

                google.charts.load('current', { packages: ['corechart', 'bar'] });
                google.charts.setOnLoadCallback(drawColumnChart);
                })
        }

      // Draw column chart
      // Inputs:
      // googleChartData .. rows of data
      // xAxisTitle ....... title of horizontal chart axis
      // yAxisTitle........ title of vertical chart axis, and first series
      // yAxisTitle2 ...... title of second series, or null
      // yAxisTitle3 ...... title of third series, or null

      function drawColumnChart() {

          var data = new google.visualization.DataTable();
          data.addColumn('string', xAxisTitle);
          data.addColumn('number', yAxisTitle);

          if (yAxisTitle2) {
              data.addColumn('number', yAxisTitle2);
          }

          if (yAxisTitle3) {
              data.addColumn('number', yAxisTitle3);
          }

          data.addRows(googleChartData);

          var options = {
              title: chartTitle,
              hAxis: {
                  title: xAxisTitle,
              },
              vAxis: {
                  title: yAxisTitle
              },
          };

          var chart = new google.visualization.ColumnChart(
              document.getElementById('chart_div'));

          google.visualization.events.addListener(chart, 'select', function () {
              selection = chart.getSelection()
              var index = selection[0].row;
              var name = countrySelect[index];
              $('#country').val(name).trigger('change');
          });

          chart.draw(data, options);

          $('#loading').css('visibility', 'collapse');
          $("body").css("cursor", "default");
      }


