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
        refreshFlights();
        
    };

    vm.updateStartDate = function() {
        lowFareSearchService.setStartDate(vm.startDate);
    };

    vm.updateEndDate = function() {
        lowFareSearchService.setEndDate(vm.endDate);
    };

    var refreshFlights = function() {
        vm.selectedDestAirSegments = [];
        vm.airSegments = lowFareSearchService.filterResults();
        for (var i = vm.airSegments.length - 1; i >= 0; i--) {
            if(vm.selectedDestination == vm.airSegments[i]['destination']) {
                vm.selectedDestAirSegments = vm.airSegments[i];
            }
        }
    }
    

    vm.flightSelected = flightSelected;
    vm.budget = lowFareSearchService.getBudget();

    vm.startDate = lowFareSearchService.getStartDate(); //Date object
    vm.endDate = lowFareSearchService.getEndDate(); //Date object
    
    vm.redirectToHotels = redirectToHotels;
    
    
    vm.selectedDestination = lowFareSearchService.getSelectedDestination();
    vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
    
    
    refreshFlights();
    if(!lowFareSearchService.getSelectedAirSegment() && vm.selectedDestAirSegments && vm.selectedDestAirSegments.length > 0) {
        flightSelected(vm.selectedDestAirSegments['segments'][0]);
    }    
    if(vm.selectedDestAirSegments && vm.selectedDestAirSegments['segments']) {
        lowFareSearchService.updateRelativePricings(vm.selectedDestAirSegments['segments']);
    }
    
    
  }]);
