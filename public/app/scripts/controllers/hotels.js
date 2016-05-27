'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HotelsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService', 'hotelSearchService', 'util', 'cityNamesService',
        function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService, util, cityNamesService) {

            var vm = this;


            var hotelSelected = function (hotel) {
                lowFareSearchService.setSelectedHotel(hotel);
                vm.selectedHotelPrice = parseInt(hotel['TotalMinAmountNum']);
                vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
            };
            
            var redirectToPayment = function(hotel) {
                hotelSelected(hotel);
                $state.go('payment');  
            };

            vm.budgetChange = function() {
                //console.log('budgetChange', vm.budget);
                lowFareSearchService.setBudget(vm.budget);
                //TODO: filtering
                // vm.airSegments = lowFareSearchService.filterResults();
            };

           vm.distanceChange = function() {
                //console.log('budgetChange', vm.budget);
                lowFareSearchService.setDistance(vm.distance);
                vm.airSegments = lowFareSearchService.filterResults();
                // vm.selectedDestAirSegments = lowFareSearchService.getFlights(vm.selectedDestination);

                for (var i = vm.airSegments.length - 1; i >= 0; i--) {
                    if(vm.airSegments[i]['destination'] == vm.selectedDestination) {
                        vm.hotels = vm.airSegments[i]['hotels'];
                        break;
                    }
                };



                // var cached = hotelSearchService.getParsedCacheResults()
                // vm.hotels = cached[cityNamesService.getCityCodeAlias(vm.selectedDestination)];
            };                        

            vm.selectedTotalPrice = 0;
            vm.hotelSelected = hotelSelected;    
            vm.redirectToPayment = redirectToPayment;    
                    
            vm.budget = lowFareSearchService.getBudget();
            vm.distance = lowFareSearchService.getDistance();

            vm.startDate = lowFareSearchService.getStartDate(); //Date object
            vm.endDate = lowFareSearchService.getEndDate(); //Date object                    

            vm.selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.selectedAirSegment = lowFareSearchService.getSelectedAirSegment();
            // vm.loading = true;
            // hotelSearchService.getHotelSearchResults(selectedDestination).then(successFunction, failureFunction);
            var cached = hotelSearchService.getParsedCacheResults()
            vm.hotels = cached[cityNamesService.getCityCodeAlias(vm.selectedDestination)];
            console.log("cache.hotels", vm.hotels);

            if(vm.hotels && vm.hotels.length > 0) {
                util.sortObjects(vm.hotels, 'TotalMinAmountNum');
                hotelSearchService.updateRelativePricings(vm.hotels);
                hotelSelected(vm.hotels[0]);
            }


}]);
