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
                vm.selectedHotelPrice = util.string2Num(hotel['TotalMinAmountNum']);
                vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
            };
            
            var redirectToPayment = function(hotel) {
                hotelSelected(hotel);
                $state.go('payment');  
            };

            vm.budgetChange = function() {

                lowFareSearchService.setBudget(vm.budget);
                refreshHotels();            
            };

           vm.distanceChange = function() {

                lowFareSearchService.setDistance(vm.distance);
                refreshHotels();                
            };                        

            var refreshHotels = function() {
                // vm.airSegments = lowFareSearchService.filterResults();
                // // vm.selectedDestAirSegments = lowFareSearchService.getFlights(vm.selectedDestination);
                // if(vm.airSegments.length > 0) {
                //     for (var i = vm.airSegments.length - 1; i >= 0; i--) {
                //         if(vm.airSegments[i]['destination'] == vm.selectedDestination) {
                //             vm.hotels = vm.airSegments[i]['hotels'];
                //             break;
                //         }
                //     }
                // }else{
                //     vm.hotels = [];
                // }
                // util.sortObjects(vm.hotels, 'TotalMinAmountNum');
                vm.hotels = [];
                
                vm.selectedDestAirSegments = lowFareSearchService.getFlightsForDestination(vm.selectedDestination);
                if(vm.selectedDestAirSegments) {
                    vm.hotels = vm.selectedDestAirSegments['hotels'];
                }
                hotelSearchService.updateRelativePricings(vm.hotels);
            };

            // vm.selectedTotalPrice = 0;
            vm.hotelSelected = hotelSelected;    
            vm.redirectToPayment = redirectToPayment;    
                    
            vm.budget = lowFareSearchService.getBudget();
            vm.distance = lowFareSearchService.getDistance();

            vm.startDate = lowFareSearchService.getStartDate(); //Date object
            vm.endDate = lowFareSearchService.getEndDate(); //Date object                    

            vm.selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.selectedAirSegment = lowFareSearchService.getSelectedAirSegment();
            vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
            // vm.loading = true;
            // hotelSearchService.getHotelSearchResults(selectedDestination).then(successFunction, failureFunction);
            // var cached = hotelSearchService.getParsedCacheResults()
            // vm.hotels = cached[cityNamesService.getCityCodeAlias(vm.selectedDestination)];
            // console.log("cache.hotels", vm.hotels);
            refreshHotels();
            if(!lowFareSearchService.getSelectedHotel() && vm.hotels && vm.hotels.length > 0) {
                hotelSelected(vm.hotels[0]);
            }
            
            // util.sortObjects(vm.hotels, 'TotalMinAmountNum');
            // hotelSearchService.updateRelativePricings(vm.hotels);

}]);
