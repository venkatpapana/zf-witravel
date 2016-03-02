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
    var budget = 200, numTravellers=2;
    var searchStatus = false, searchResults=[];

    var  setBudget = function(b) {
      budget = b;
    }

    var getBudget = function(){
      return budget;
    };

    var  setNumTravellers = function(n) {
      numTravellers = n;
    };

    var getNumTravellers = function(){
      return numTravellers;
    };


    var getLowFareSearchResults = function() {
          return $http({
            method: 'GET',
            url: wiConfig.serviceURL+'/flights/low-fare-search'
          }).then(function successFunction(response){
            searchResults = response.data;
            searchStatus = true;
            return searchStatus;
          }, function failureFunction(response){
            return searchStatus;
          });
    };

    var getSavedResults = function() {
      return searchResults;
    };

    return {
      setBudget: setBudget,
      getBudget: getBudget,
      setNumTravellers: setNumTravellers,
      getNumTravellers: getNumTravellers,
      getLowFareSearchResults: getLowFareSearchResults,
      getSavedResults: getSavedResults
    };

  }]);
