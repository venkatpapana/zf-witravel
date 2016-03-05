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
    var budget = 200, numTravellers=2, twoWay = false;
    var searchStatus = false, searchResults=null;
    var respResults = [];

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


    var getAirSegment = function(segKey) {
      var airSegment = null;
      if(searchResults != null) {
        var arrAirSegments = searchResults['AirSegmentList']['AirSegment'];
        for (var i = 0; i < arrAirSegments.length; i++) {
          if(arrAirSegments[i]['!Key'] == segKey) {
            airSegment = arrAirSegments[i];
            break;
          }
        }
      }
      return airSegment;
    };


    var getFlights = function() {
      return respResults;
    };

    var parseFlights = function() {
      var resAirSegments = [];

      if(searchResults != null) {
        var airPricingSolutions = searchResults['AirPricingSolution'];

        if(airPricingSolutions.length > 0) {
          for (var i = 0; i < airPricingSolutions.length; i++) {
            var thisAirPricing = airPricingSolutions[i];
            if(twoWay) {
              var airSegmentKey1 = thisAirPricing['Journey']['AirSegmentRef'][0]['!Key'];
              //var airSegmentKey2 = thisAirPricing['Journey']['AirSegmentRef'][1]['!Key'];
            }else{
              var airSegmentKey1 = thisAirPricing['Journey']['AirSegmentRef']['!Key'];
            }

            var airSegment = getAirSegment(airSegmentKey1);

            if(airSegment != null) {
                resAirSegments.push(airSegment);
            }
          }//for
        } //have AirPricingSolutions
      } //have SearchResults
      respResults = resAirSegments;
    };

    return {
      setBudget: setBudget,
      getBudget: getBudget,
      setNumTravellers: setNumTravellers,
      getNumTravellers: getNumTravellers,
      getLowFareSearchResults: getLowFareSearchResults,
      getSavedResults: getSavedResults,
      parseFlights: parseFlights,
      getFlights: getFlights
    };

  }]);
