'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HomeCtrl', ['$http', '$state', '$q', 'wiConfig', 'lowFareSearchService',
        function ($http, $state, $q, wiConfig, lowFareSearchService) {

            var vm = this;

            


            function lowFareSearch() {
                console.log('LowFareSearchCriteria');
                vm.loading = true;
                lowFareSearchService.setBudget(vm.budget);
                lowFareSearchService.setNumTravellers(vm.numTravellers);


                var allDestinations = lowFareSearchService.getAllDestinations();
                // var source = 'PAR';
                // var sourceIndex = allDestinations.indexOf(source);
                // allDestinations.splice(sourceIndex, 1);
                var dest1 = allDestinations.slice(0, 6);
                var dest2 = allDestinations.slice(6, 12);
                var dest3 = allDestinations.slice(12);

                var defer = $q.defer();
                var promises = [];                

                lowFareSearchService.setSearchDestinations(dest1);
                promises.push(lowFareSearchService.getLowFareSearchResults());

                lowFareSearchService.setSearchDestinations(dest2);
                promises.push(lowFareSearchService.getLowFareSearchResults());

                lowFareSearchService.setSearchDestinations(dest3);
                promises.push(lowFareSearchService.getLowFareSearchResults());                                
                // promises.push(lowFareSearchService.getLowFareSearchResults());
                
                $q.all(promises).then(successFunction, failureFunction);

                // lowFareSearchService.getLowFareSearchResults().then(successFunction, failureFunction);
                // $state.go("destinations");
            }

            // vm.user = {name: 'guest'};
            function successFunction(response) {
                vm.loading = false;
                console.log('successFunction', response);
                if (response[0] === true) {
                    $state.go("destinations");
                }
            }

            function failureFunction(response) {
                vm.loading = false;
                console.log('failureFunction', response)
            }

            vm.budget = lowFareSearchService.getBudget();
            vm.numTravellers = lowFareSearchService.getNumTravellers();
            vm.lowFareSearch = lowFareSearch;

        }]);
