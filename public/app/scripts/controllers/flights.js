'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:FlightsCtrl
 * @description
 * # FlightsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .controller('FlightsCtrl', ['$http', '$state','wiConfig', 'lowFareSearchService', 'util',
  function ($http, $state, wiConfig, lowFareSearchService, util) {

    var vm = this;
    
    var flightSelected = function (flight) {
        lowFareSearchService.setSelectedAirSegment(flight);
        vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
    };
    

    var redirectToHotels = function(flight) {
        flightSelected(flight);
        $state.go('hotelResults');     
    };
    

    vm.flightSelected = flightSelected;

    var selectedDestination = lowFareSearchService.getSelectedDestination();
    vm.selectedDestAirSegments = lowFareSearchService.getFlights(selectedDestination);
    // util.sortObjects(vm.selectedDestAirSegments['segments'], 'TotalAirPrice');
    lowFareSearchService.updateRelativePricings(vm.selectedDestAirSegments['segments']);
    flightSelected(vm.selectedDestAirSegments[0]);
    vm.redirectToHotels = redirectToHotels;
    
  }]);
