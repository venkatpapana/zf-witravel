'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HotelsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService', 'hotelSearchService',
        function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService) {

            var vm = this;
            var selectedDestination = lowFareSearchService.getSelectedDestination();
            hotelSearchService.getHotelSearchResults(selectedDestination).then(successFunction, failureFunction);

            function successFunction(response) {
                console.log('successFunction', response);

                console.log('HotelsCtrl, getSavedResults', hotelSearchService.getSavedResults());
                hotelSearchService.parseHotels();
                // console.log('HotelsCtrl, getHotels', hotelSearchService.getHotels());
                vm.hotels = hotelSearchService.getHotels()
                // vm.results = response.data;
            }

            function failureFunction(response) {
                console.log('failureFunction', response)
            }

        }]);
