'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:AboutCtrl
 * @description
 * # test service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('lowFareSearchService', ['$http', 'wiConfig', function ($http, wiConfig) {

    return {
      getLowFareSearchResults: function() {
        return $http({
          method: 'GET',
          url: wiConfig.serviceURL+'/flights/low-fare-search'
        }).then(function successFunction(response){
          return response;
        }, function failureFunction(response){
          return response;
        });
      }
    }
  }]);
