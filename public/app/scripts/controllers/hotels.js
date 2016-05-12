'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HotelsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService', 'hotelSearchService',
        function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService) {

            var vm = this;
            var selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.loading = true;
            hotelSearchService.getHotelSearchResults(selectedDestination).then(successFunction, failureFunction);

            function successFunction(response) {
                vm.loading = false;
                // console.log('successFunction', response);

                // console.log('HotelsCtrl, getSavedResults', hotelSearchService.getSavedResults());
                hotelSearchService.parseHotels();
                // console.log('HotelsCtrl, getHotels', hotelSearchService.getHotels());
                vm.hotels = hotelSearchService.getHotels()
                // vm.results = response.data;
            }

            function failureFunction(response) {
                vm.loading = false;
                console.log('failureFunction', response)
            }

            var hotelSelected = function (hotel) {
                //alert("DestinationsCtrl::destinationSelected = "+destination);
                //lowFareSearchService.setSelectedDestination(destination);
                $state.go('payment');
            };
            vm.hotelSelected = hotelSelected;            

        }]);
