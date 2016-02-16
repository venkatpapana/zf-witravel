'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .controller('MainCtrl', ['$http', 'wiConfig', 'TestService', function ($http, wiConfig, TestService) {

    var vm = this;

    vm.user = {name: 'guest'};
    function successFunction(response) {
      console.log('successFunction', response)
      vm.user = response.data;
    }
    function failureFunction(response) {
      console.log('failureFunction', response)
    }
    TestService.getUserDetails().then(successFunction,failureFunction);


  }]);
