'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:lowFareSearchService
 * @description
 * # lowFareSearchService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('lowFareSearchService', ['$http', 'wiConfig', 'cityNamesService', function ($http, wiConfig, cityNamesService) {
        var origin = 'AMS';

        var allDestinations = ['AMS', 'BER', 'BCN', 'LON', 'CPH', 'PAR', 'IST', 'BRU', 'AGP', 'ROM', 'KRK', 'TLL', 'LIS'];
        var searchDestinations;

        var budget = 200, numTravellers = 2, twoWay = true;

        var searchStatus = false, searchResults = null;
        var respResults = [];

        var selectedDestination, selectedAirSegment, selectedHotel;

        var setOrigin = function (o) {
            origin = o;
        }        

        var getOrigin = function () {
            //TODO: get location based on IP address
            return origin;
        }

        var setBudget = function (b) {
            budget = b;
        }

        var getBudget = function () {
            return budget;
        };

        var setNumTravellers = function (n) {
            numTravellers = n;
        };

        var getNumTravellers = function () {
            return numTravellers;
        };

        var getAllDestinations = function() {
            return allDestinations;
        };

        var setSearchDestinations = function(destinations) {
            searchDestinations = destinations;
        };

        var getSearchDestinationsAsString = function(destinations) {
            return searchDestinations.join();;
        };        

        var getLowFareSearchResults = function () {
            return $http({
                method: 'GET',
                url: wiConfig.serviceURL + '/flights/low-fare-search/origin/' + getOrigin() + '/budget/' + getBudget() + '/travellers/' + getNumTravellers() + '/destinations/'+getSearchDestinationsAsString()
            }).then(function successFunction(response) {
                searchResults = response.data;
                searchStatus = true;
                return searchStatus;
            }, function failureFunction(response) {
                return searchStatus;
            });
        };

        var getSavedResults = function () {
            return searchResults;
        };


        var getAirSegment = function (segKey) {
            var airSegment = null;
            if (searchResults != null) {
                var arrAirSegments = searchResults['AirSegmentList']['AirSegment'];
                for (var i = 0; i < arrAirSegments.length; i++) {
                    if (arrAirSegments[i]['!Key'] == segKey) {
                        airSegment = arrAirSegments[i];
                        break;
                    }
                }
            }
            return airSegment;
        };

        var getAllFlights = function () {
            return respResults;
        };

        var getFlights = function (destination) {
            var flightsForDestination = [];
            for (var i = 0; i < respResults.length; i++) {
                if (destination == undefined || destination == null || respResults[i].destination == destination) {
                    flightsForDestination = respResults[i];
                    break;
                }
            }
            return flightsForDestination;
        };

        var parseFlights = function () {
            var resAirSegments = [], arrDestinations = [];

            if (searchResults != null) {
                var airPricingSolutions = searchResults['AirPricingSolution'];

                if (airPricingSolutions.length > 0) {
                    for (var i = 0; i < airPricingSolutions.length; i++) {
console.log('airPricingSolutions -->', i);
                        var thisAirPricing = airPricingSolutions[i];


                        var thisTotalPrice = thisAirPricing['!TotalPrice'];
                        if(thisTotalPrice && thisTotalPrice.substring(0, 3) === 'EUR') {
                            thisTotalPrice = parseInt(thisTotalPrice.substring(3, thisTotalPrice.length));
                            if(thisTotalPrice > getBudget()) {
                                continue;
                            }
                        }else if(getBudget()){
                            thisTotalPrice = getBudget(); //TODO: 
                        }
                        

                        var arrFlights = {};

                        if (twoWay && thisAirPricing['Journey'][0] != undefined) {
                            var airSegmentKey1 = thisAirPricing['Journey'][0]['AirSegmentRef']['!Key'];
                            var airSegmentKey2 = thisAirPricing['Journey'][1]['AirSegmentRef']['!Key'];
                        } else if(thisAirPricing['Journey']['AirSegmentRef']){
                            var airSegmentKey1 = thisAirPricing['Journey']['AirSegmentRef']['!Key'];
                        }

                        var airSegment1 = getAirSegment(airSegmentKey1);

                        if (airSegment1 != null) {
                            airSegment1['TotalPrice'] = thisTotalPrice;
                            airSegment1['DestinationDisplay'] = cityNamesService.getCityNameForCode(airSegment1['!Destination']);
                            
                            arrFlights['onward'] = airSegment1;
                            
                            // resAirSegments.push(airSegment1);
                        }

                        if (twoWay) {
                            var airSegment2 = getAirSegment(airSegmentKey2);
                            if (airSegment2 != null) {
                                airSegment2['TotalPrice'] = thisTotalPrice;
                                airSegment2['DestinationDisplay'] = cityNamesService.getCityNameForCode(airSegment2['!Destination']);
                                arrFlights['return'] = airSegment2;                                
                                // resAirSegments.push(airSegment2);
                            }
                        }

                        if (airSegment1 != null) {
                            if (arrDestinations.indexOf(airSegment1['!Destination']) < 0) {
                                arrDestinations.push(airSegment1['!Destination']);
                                resAirSegments[airSegment1['!Destination']] = [];
                            }
                            // if(resAirSegments[airSegment1['!Destination']] == undefined) {
                            //   resAirSegments[airSegment1['!Destination']] = [];
                            // }

                            resAirSegments[airSegment1['!Destination']].push(arrFlights);
                        }
                    }//for
                } //have AirPricingSolutions
            } //have SearchResults

            console.log("resAirSegments", resAirSegments);

            //clear prev. results, if any
            respResults = [];
            angular.forEach(arrDestinations, function (value, key) {
                var thisDestination = {"destination": value, "segments": resAirSegments[value]};
                respResults.push(thisDestination);
            });

            // respResults = resAirSegments;
        };

        var setSelectedDestination = function (destination) {
            selectedDestination = destination;
        }
        var setSelectedAirSegment = function (airSegment) {
            selectedAirSegment = airSegment;
        }
        var setSelectedHotel = function (hotel) {
            selectedHotel = hotel;
        }

        var getSelectedDestination = function () {
            return selectedDestination;
        }
        var getSelectedAirSegment = function () {
            return selectedAirSegment;
        }
        var getSelectedHotel = function () {
            return selectedHotel;
        }

        return {
            setBudget: setBudget,
            getBudget: getBudget,
            setNumTravellers: setNumTravellers,
            getNumTravellers: getNumTravellers,
            getLowFareSearchResults: getLowFareSearchResults,
            getSavedResults: getSavedResults,
            parseFlights: parseFlights,
            getAllFlights: getAllFlights,
            getFlights: getFlights,
            setSelectedDestination: setSelectedDestination,
            setSelectedAirSegment: setSelectedAirSegment,
            setSelectedHotel: setSelectedHotel,
            getSelectedDestination: getSelectedDestination,
            getSelectedAirSegment: getSelectedAirSegment,
            getSelectedHotel: getSelectedHotel,
            getAllDestinations: getAllDestinations,
            setSearchDestinations: setSearchDestinations
        };

    }]);
