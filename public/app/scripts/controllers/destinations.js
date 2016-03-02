'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .controller('DestinationsCtrl', ['$http', '$state','wiConfig', 'lowFareSearchService',
  function ($http, $state, wiConfig, lowFareSearchService) {

    var vm = this;
    //vm.results = lowFareSearchService.searchResults

    console.log('DestinationsCtrl, searchResults', lowFareSearchService.getSavedResults());

    lowFareSearchService.parseFlights();
    console.log('DestinationsCtrl, getFlights', lowFareSearchService.getFlights());
    vm.airSegments = lowFareSearchService.getFlights()

    // vm.user = {name: 'guest'};
    function successFunction(response) {
      console.log('successFunction', response)
      // vm.results = response.data;
    }
    function failureFunction(response) {
      console.log('failureFunction', response)
    }



  }]);
