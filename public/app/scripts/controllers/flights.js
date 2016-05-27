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

    vm.budgetChange = function() {
        //console.log('budgetChange', vm.budget);
        lowFareSearchService.setBudget(vm.budget);
        // vm.airSegments = lowFareSearchService.filterResults();
    };

    vm.updateStartDate = function() {
        lowFareSearchService.setStartDate(vm.startDate);
    };

    vm.updateEndDate = function() {
        lowFareSearchService.setEndDate(vm.endDate);
    };
    

    vm.flightSelected = flightSelected;
    vm.budget = lowFareSearchService.getBudget();

    vm.startDate = lowFareSearchService.getStartDate(); //Date object
    vm.endDate = lowFareSearchService.getEndDate(); //Date object

    vm.selectedDestination = lowFareSearchService.getSelectedDestination();
    vm.selectedDestAirSegments = lowFareSearchService.getFlights(vm.selectedDestination);
    // util.sortObjects(vm.selectedDestAirSegments['segments'], 'TotalAirPrice');
    lowFareSearchService.updateRelativePricings(vm.selectedDestAirSegments['segments']);
    flightSelected(vm.selectedDestAirSegments['segments'][0]);
    vm.redirectToHotels = redirectToHotels;
    
  }]);
