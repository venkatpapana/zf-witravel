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
                // vm.airSegments = lowFareSearchService.filterResults(vm.budget);
            };            

            vm.selectedTotalPrice = 0;
            vm.hotelSelected = hotelSelected;    
            vm.redirectToPayment = redirectToPayment;    
                    
            vm.budget = lowFareSearchService.getBudget();

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
