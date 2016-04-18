'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HomeCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService',
        function ($http, $state, wiConfig, lowFareSearchService) {

            var vm = this;


            function lowFareSearch() {
                console.log('LowFareSearchCriteria')
                lowFareSearchService.setBudget(vm.budget);
                lowFareSearchService.setNumTravellers(vm.numTravellers);
                lowFareSearchService.getLowFareSearchResults().then(successFunction, failureFunction);
                // $state.go("destinations");
            }

            // vm.user = {name: 'guest'};
            function successFunction(response) {
                console.log('successFunction', response)
                if (response === true) {
                    $state.go("destinations");
                }
            }

            function failureFunction(response) {
                console.log('failureFunction', response)
            }

            vm.budget = lowFareSearchService.getBudget();
            vm.numTravellers = lowFareSearchService.getNumTravellers();
            vm.lowFareSearch = lowFareSearch;

        }]);