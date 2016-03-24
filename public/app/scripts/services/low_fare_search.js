'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:AboutCtrl
 * @description
 * # test service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('lowFareSearchService', ['$http', 'wiConfig', function ($http, wiConfig) {
        var origin = 'AMS';
        var budget = 200, numTravellers = 2, twoWay = true;

        var searchStatus = false, searchResults = null;
        var respResults = [];

        var selectedDestination, selectedAirSegment, selectedHotel;

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


        var getLowFareSearchResults = function () {
            return $http({
                method: 'GET',
                url: wiConfig.serviceURL + '/flights/low-fare-search/origin/' + getOrigin() + '/budget/' + getBudget() + '/travellers/' + getNumTravellers()
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

                        var thisAirPricing = airPricingSolutions[i];

                        var arrFlights = {};

                        if (twoWay) {
                            var airSegmentKey1 = thisAirPricing['Journey'][0]['AirSegmentRef']['!Key'];
                            var airSegmentKey2 = thisAirPricing['Journey'][1]['AirSegmentRef']['!Key'];
                        } else {
                            var airSegmentKey1 = thisAirPricing['Journey']['AirSegmentRef']['!Key'];
                        }

                        var airSegment1 = getAirSegment(airSegmentKey1);

                        if (airSegment1 != null) {
                            arrFlights['onward'] = airSegment1;
                            // resAirSegments.push(airSegment1);
                        }

                        if (twoWay) {
                            var airSegment2 = getAirSegment(airSegmentKey2);
                            if (airSegment2 != null) {
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
            getSelectedHotel: getSelectedHotel
        };

    }]);
