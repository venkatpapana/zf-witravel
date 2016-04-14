'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
<<<<<<< HEAD
  .controller('HotelsCtrl', ['$http', '$state','wiConfig', 'lowFareSearchService', 'hotelSearchService', 'hotelImagesService'
  function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService) {
=======
    .controller('HotelsCtrl', ['$http', '$state', 'wiConfig', 'lowFareSearchService', 'hotelSearchService',
        function ($http, $state, wiConfig, lowFareSearchService, hotelSearchService) {
>>>>>>> 1dcfde45d9810ac87c713a10c44ec0993ab42330

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
