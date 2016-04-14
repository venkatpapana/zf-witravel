'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:FlightsCtrl
 * @description
 * # FlightsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .controller('FlightsCtrl', ['$http', '$state','wiConfig', 'lowFareSearchService',
  function ($http, $state, wiConfig, lowFareSearchService) {

    var vm = this;
    //vm.results = lowFareSearchService.searchResults

    //console.log('FlightsCtrl, searchResults', lowFareSearchService.getSavedResults());
    var selectedDestination = lowFareSearchService.getSelectedDestination();

    //lowFareSearchService.parseFlights();

    vm.destinationAirSegments = lowFareSearchService.getFlights(selectedDestination);
    console.log('FlightsCtrl::destinationAirSegments', vm.destinationAirSegments);

    // vm.user = {name: 'guest'};
    function successFunction(response) {
      console.log('successFunction', response)
      // vm.results = response.data;
    }
    function failureFunction(response) {
      console.log('failureFunction', response)
    }



  }]);
