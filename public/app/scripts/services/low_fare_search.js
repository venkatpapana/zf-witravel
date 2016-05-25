'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:lowFareSearchService
 * @description
 * # lowFareSearchService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('lowFareSearchService', ['$http', 'wiConfig', 'cityNamesService', 'hotelSearchService', 'util',
        function ($http, wiConfig, cityNamesService, hotelSearchService, util) {
        var origin = 'Madrid';

        //var allDestinations = ['AMS', 'BER', 'BCN', 'LON', 'CPH', 'PAR', 'IST', 'BRU', 'AGP', 'ROM', 'KRK', 'TLL', 'LIS'];
        var allDestinations = cityNamesService.getDestinationCityCodes();
        var searchDestinations;

        var budget = 500, numTravellers = 2, twoWay = true;
        var startDate = util.nextDayofWeekDate(5), endDate = util.nextDayofWeekDate(7); //Date object 
        var sortBy = 'price';

        var searchStatus = false; //, searchResults = null;
        var respResults = [];
        var resAirSegments = {};

        var selectedDestination = null, selectedAirSegment = null, selectedHotel = null, selectedTotalPrice = 0;

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

        var setStartDate = function (d) {
            startDate = d;
        }

        var getStartDate = function () {
            return startDate;
        };  

        var setEndDate = function (d) {
            endDate = d;
        }

        var getEndDate = function () {
            return endDate;
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
                url: wiConfig.serviceURL + '/flights/low-fare-search/origin/' + getOrigin() + 
                        '/budget/' + getBudget() + '/travellers/' + getNumTravellers() + 
                        '/startDate/' + util.convertDate2PhpString(getStartDate()) + '/endDate/' + util.convertDate2PhpString(getEndDate()) + 
                        '/destinations/'+getSearchDestinationsAsString()
            }).then(function successFunction(response) {
                //console.log("getLowFareSearchResults ---> success", response.data)
                //searchResults = response.data;
                parseFlights(response.data)
                searchStatus = true;
                return searchStatus;
            }, function failureFunction(response) {
                return searchStatus;
            });
        };

        var getSavedResults = function () {
            return searchResults;
        };


        var getAirSegment = function (searchResults, segKey) {
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
            //clear prev. results, if any  
            respResults = [];          
            angular.forEach(resAirSegments, function (segments, dest) {
                //console.log("dest", dest);
                util.sortObjects(segments, 'TotalAirPrice')
                var thisDestination = {"destination": dest, "segments": segments};
                respResults.push(thisDestination);
            });

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
            util.sortObjects(flightsForDestination['segments'], 'TotalAirPrice');
            return flightsForDestination;
        };

        var clearResults = function() {
            respResults = [];
            resAirSegments = {};

        };

        var parseFlights = function (searchResults) {
            //console.log("parseFlights(): ENTER --> resAirSegments = ", resAirSegments);
            //var resAirSegments = {}, arrDestinations = [];

            if (searchResults != null && searchResults['AirPricingSolution'] != undefined) {
                var airPricingSolutions = searchResults['AirPricingSolution'];

                if (airPricingSolutions.length > 0) {
                    for (var i = 0; i < airPricingSolutions.length; i++) {
//console.log('airPricingSolutions -->', i);
                        var thisAirPricing = airPricingSolutions[i];


                        var thisTotalPrice = thisAirPricing['!TotalPrice'];
                        if(thisTotalPrice && thisTotalPrice.substring(0, 3) === 'EUR') {
                            thisTotalPrice = parseInt(thisTotalPrice.substring(3, thisTotalPrice.length));
                            // if(thisTotalPrice > getBudget()) {
                            //     continue;
                            // }
                        }else if(getBudget()){
                            thisTotalPrice = 0; //getBudget(); //TODO: 
                        }
                        

                        var arrFlights = {};
                        arrFlights['TotalAirPrice'] = thisTotalPrice;

                        if (twoWay && thisAirPricing['Journey'][0] != undefined) {
                            var airSegmentKey1 = thisAirPricing['Journey'][0]['AirSegmentRef']['!Key'];
                            var airSegmentKey2 = thisAirPricing['Journey'][1]['AirSegmentRef']['!Key'];
                        } else if(thisAirPricing['Journey']['AirSegmentRef']){
                            var airSegmentKey1 = thisAirPricing['Journey']['AirSegmentRef']['!Key'];
                        }

                        var airSegment1 = getAirSegment(searchResults, airSegmentKey1);

                        if (airSegment1 != null) {
                            // airSegment1['TotalPrice'] = thisTotalPrice;
                            // arrFlights['TotalAirPrice'] += airSegment1['TotalPrice'];
                            airSegment1['DestinationDisplay'] = cityNamesService.getCityNameForCode(airSegment1['!Destination']);
                            
                            arrFlights['onward'] = airSegment1;
                            
                            // resAirSegments.push(airSegment1);
                        }

                        if (twoWay) {
                            var airSegment2 = getAirSegment(searchResults, airSegmentKey2);
                            if (airSegment2 != null) {
                                // airSegment2['TotalPrice'] = thisTotalPrice;
                                // arrFlights['TotalAirPrice'] += airSegment2['TotalPrice'];
                                airSegment2['DestinationDisplay'] = cityNamesService.getCityNameForCode(airSegment2['!Destination']);
                                arrFlights['return'] = airSegment2;                                
                                // resAirSegments.push(airSegment2);
                            }
                        }

                        if (airSegment1 != null) {
                            // if (arrDestinations.indexOf(airSegment1['!Destination']) < 0) {
                            //     arrDestinations.push(airSegment1['!Destination']);
                            //     resAirSegments[airSegment1['!Destination']] = [];
                            // }
                            // if(resAirSegments[airSegment1['!Destination']] == undefined) {
                            //   resAirSegments[airSegment1['!Destination']] = [];
                            // }
                            if(!(airSegment1['!Destination'] in resAirSegments)) {
                                resAirSegments[airSegment1['!Destination']] = [];
                            }
                            //console.log('destination ----> '+airSegment1['!Destination']);
                            resAirSegments[airSegment1['!Destination']].push(arrFlights);
                        }
                    }//for
                } //have AirPricingSolutions
            } //have SearchResults

            //console.log("resAirSegments", resAirSegments);

            //console.log("parseFlights(): END --> resAirSegments = ", resAirSegments);
            // respResults = resAirSegments;
        };

        var setSelectedDestination = function (destination) {
            selectedDestination = destination;
            updateSelectedTotalPrice();
        };
        var setSelectedAirSegment = function (airSegment) {
            selectedAirSegment = airSegment;
            updateSelectedTotalPrice();
        };
        var setSelectedHotel = function (hotel) {
            selectedHotel = hotel;
            updateSelectedTotalPrice();
        };

        var getSelectedDestination = function () {
            return selectedDestination;
        };
        var getSelectedAirSegment = function () {
            return selectedAirSegment;
        };
        var getSelectedHotel = function () {
            return selectedHotel;
        };



        var filterResults = function(budget) {
            
            var allAirSegments = getAllFlights();
            var allHotelResults = hotelSearchService.getParsedCacheResults();

            var airSegments = [];
            // vm.hotelResults = [];

            for (var i = 0; i < allAirSegments.length; i++) {                
                var thisSegment = allAirSegments[i];
                allAirSegments[i]['hotels'] = [];

                var destCityCode = cityNamesService.getCityCodeAlias(thisSegment['destination']);
                // console.log('destCityCode', destCityCode);

                var airPrice = parseInt(thisSegment['segments'][0]['TotalAirPrice']);
                // if(thisSegment['segments'][0]['return'] != undefined && thisSegment['segments'][0]['return'] != null) {
                //     airPrice += parseInt(thisSegment['segments'][0]['return']['TotalPrice']);
                // }
                var thisHotels = [], thisFlightHotelMin=0;
                if(allHotelResults[destCityCode] != undefined  && allHotelResults[destCityCode] != null) { //twoWay && 

                    for (var j = 0; j < allHotelResults[destCityCode].length; j++) {
                        var thisHotel = allHotelResults[destCityCode][j];
                        var hotelPrice = parseInt(thisHotel['TotalMinAmountNum']);

                        var total = airPrice+hotelPrice;
                        // console.log('destCityCode='+destCityCode+', airPrice='+airPrice+', hotelPrice='+hotelPrice+', total='+total+', budget='+budget);

                        if(  total >  budget) {
                            // console.log('-----> skip');
                            continue;
                        }else{
                            // console.log('-----> add');
                            if(total < thisFlightHotelMin || thisFlightHotelMin == 0) {
                                thisFlightHotelMin = total;
                            }
                            thisHotels.push(thisHotel);
                        }
                    }
                    if(thisHotels.length > 0) {
                        util.sortObjects(thisHotels, 'TotalMinAmountNum');                                
                    }
                    
                }else{
                    continue;
                }
                if(thisHotels.length > 0) {
                    thisSegment['hotels'] = thisHotels;
                    thisSegment['MinTotalPrice'] = thisFlightHotelMin;
                    airSegments.push(thisSegment);
                }
            }//for
            
            util.sortObjects(airSegments, 'MinTotalPrice');
            return airSegments;
        };

        var updateRelativePricings = function(sortedSegments) {
            var minPrice = parseInt(sortedSegments[0]['TotalAirPrice']);
            sortedSegments[0]['relativeAirPrice'] = minPrice;
            sortedSegments[0]['relativeAirPriceDisplay'] = minPrice;

            for (var i = sortedSegments.length - 1; i > 0; i--) {
                var thisHotelPrice = parseInt(sortedSegments[i]['TotalAirPrice']);
                var thisRelativePrice = (thisHotelPrice - minPrice);
                
                sortedSegments[i]['relativeAirPrice'] = thisRelativePrice;
                sortedSegments[i]['relativeAirPriceDisplay'] = ' +' + thisRelativePrice;
            };
        };


        var updateSelectedTotalPrice = function() {
            // filterResults(getBudget());

            if(selectedDestination) {
                var flights = getFlights(selectedDestination);
                selectedTotalPrice = flights['MinTotalPrice'];
            }
            if(selectedAirSegment) {
                var airPrice = parseInt(selectedAirSegment['TotalAirPrice']);
                var hotelPrice = parseInt(flights['hotels'][0]['TotalMinAmountNum']);
                selectedTotalPrice = airPrice + hotelPrice;
            }
            if(selectedHotel) {
                var airPrice = parseInt(selectedAirSegment['TotalAirPrice']);
                var hotelPrice = parseInt(selectedHotel['TotalMinAmountNum']);
                selectedTotalPrice = airPrice + hotelPrice;                
            }
        };

        var getSelectedTotalPrice = function() {
            return selectedTotalPrice;
        };


        return {
            setBudget: setBudget,
            getBudget: getBudget,
            setNumTravellers: setNumTravellers,
            setOrigin: setOrigin,
            getNumTravellers: getNumTravellers,
            setStartDate: setStartDate,
            getStartDate: getStartDate,
            setEndDate: setEndDate,
            getEndDate: getEndDate,
            getLowFareSearchResults: getLowFareSearchResults,
            getSavedResults: getSavedResults,
            //parseFlights: parseFlights,
            getAllFlights: getAllFlights,
            getFlights: getFlights,
            setSelectedDestination: setSelectedDestination,
            setSelectedAirSegment: setSelectedAirSegment,
            setSelectedHotel: setSelectedHotel,
            getSelectedDestination: getSelectedDestination,
            getSelectedAirSegment: getSelectedAirSegment,
            getSelectedHotel: getSelectedHotel,
            getAllDestinations: getAllDestinations,
            setSearchDestinations: setSearchDestinations,
            clearResults: clearResults,
            filterResults: filterResults,
            updateRelativePricings: updateRelativePricings,
            getSelectedTotalPrice: getSelectedTotalPrice

        };

    }]);
