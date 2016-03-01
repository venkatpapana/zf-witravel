'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .controller('HomeCtrl', ['$http', '$state','wiConfig', 'lowFareSearchService',
  function ($http, $state, wiConfig, lowFareSearchService) {

    var vm = this;

    //default
    vm.budget = 100;
    vm.numPassengers = 2;

    function lowFareSearch() {
      //console.log('lowFareSearch')

      //lowFareSearchService.getLowFareSearchResults().then(successFunction,failureFunction);
      $state.go("destinations");
    }

    vm.lowFareSearch = lowFareSearch;

    // vm.user = {name: 'guest'};
    function successFunction(response) {
      console.log('successFunction', response)
      // vm.results = response.data;
    }
    function failureFunction(response) {
      console.log('failureFunction', response)
    }



  }]);
