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
            vm.airSegments = lowFareSearchService.getAllFlights();
            vm.hotelResults = hotelSearchService.getParsedCacheResults();

            for (var i = 0; i < vm.airSegments.length; i++) {                
                var thisCity = vm.airSegments[i];
                vm.airSegments[i]['hotels'] = [];

                var destCityCode = cityNamesService.getCityCodeAlias(thisCity['destination']);

                if(vm.hotelResults[destCityCode] != undefined  && vm.hotelResults[destCityCode] != null) {
                    vm.airSegments[i]['hotels'] = vm.hotelResults[destCityCode];
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
