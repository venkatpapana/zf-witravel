'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:DestinationsCtrl
 * @description
 * # DestinationsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('DestinationsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService', 'hotelSearchService', 'cityNamesService',
        function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService, cityNamesService) {

            var vm = this;
            //vm.results = lowFareSearchService.searchResults

            //console.log('DestinationsCtrl, searchResults', lowFareSearchService.getSavedResults());

            //lowFareSearchService.parseFlights();
            //console.log('DestinationsCtrl, getAllFlights', lowFareSearchService.getAllFlights());
            var budget = lowFareSearchService.getBudget();
            var allAirSegments = lowFareSearchService.getAllFlights();
            var allHotelResults = hotelSearchService.getParsedCacheResults();

            vm.airSegments = [];
            // vm.hotelResults = [];

            for (var i = 0; i < allAirSegments.length; i++) {                
                var thisSegment = allAirSegments[i];
                allAirSegments[i]['hotels'] = [];

                var destCityCode = cityNamesService.getCityCodeAlias(thisSegment['destination']);
                console.log('destCityCode', destCityCode);

                var airPrice = parseInt(thisSegment['segments'][0]['onward']['TotalPrice']);
                var thisHotels = [], thisHotelMin=0;
                if(allHotelResults[destCityCode] != undefined  && allHotelResults[destCityCode] != null) {

                    for (var j = 0; j < allHotelResults[destCityCode].length; j++) {
                        var thisHotel = allHotelResults[destCityCode][j];
                        var hotelPrice = parseInt(thisHotel['TotalMinAmountNum']);

                        var total = airPrice+hotelPrice;
                        console.log('airPrice='+airPrice+', hotelPrice='+hotelPrice+', total='+total+', budget='+budget);

                        if(  total >  budget) {
                            console.log('-----> skip');
                            continue;
                        }else{
                            console.log('-----> add');
                            if(total < thisHotelMin || thisHotelMin == 0) {
                                thisHotelMin = total;
                            }
                            thisHotels.push(thisHotel);
                        }
                    }                                
                    
                }else{
                    continue;
                }
                if(thisHotels.length > 0) {
                    thisSegment['hotels'] = thisHotels;
                    thisSegment['TotalPrice'] = thisHotelMin;
                    vm.airSegments.push(thisSegment);
                }

            };

            // vm.user = {name: 'guest'};
            function successFunction(response) {
                // console.log('successFunction', response)
                // vm.results = response.data;
            }

            function failureFunction(response) {
                console.log('failureFunction', response)
            }

            var destinationSelected = function (destination) {
                //alert("DestinationsCtrl::destinationSelected = "+destination);
                lowFareSearchService.setSelectedDestination(destination);
                $state.go('flightResults');
            };

            vm.destinationSelected = destinationSelected;


        }]);
