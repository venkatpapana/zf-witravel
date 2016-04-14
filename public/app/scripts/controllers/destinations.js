'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:DestinationsCtrl
 * @description
 * # DestinationsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('DestinationsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService',
        function ($http, $state, wiConfig, lowFareSearchService) {

            var vm = this;
            //vm.results = lowFareSearchService.searchResults

            //console.log('DestinationsCtrl, searchResults', lowFareSearchService.getSavedResults());

            lowFareSearchService.parseFlights();
            console.log('DestinationsCtrl, getAllFlights', lowFareSearchService.getAllFlights());
            vm.airSegments = lowFareSearchService.getAllFlights()

            // vm.user = {name: 'guest'};
            function successFunction(response) {
                console.log('successFunction', response)
                // vm.results = response.data;
            }

            function failureFunction(response) {
                console.log('failureFunction', response)
            }

            var destinationSelected = function (destination) {
                //alert("DestinationsCtrl::destinationSelected = "+destination);
                lowFareSearchService.setSelectedDestination(destination);
            }

            vm.destinationSelected = destinationSelected;


        }]);
