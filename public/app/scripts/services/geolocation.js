'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelImagesService
 * @description
 * # hotelImagesService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('geolocationService', ['$http', 'wiConfig', function ($http, wiConfig) {
    
    var res=null;
    var getGeoLocation = function() {
          return $http({
            method: 'GET',
            url: wiConfig.serviceURL+'/GeoLocation'
          }).then(function successFunction(response){
            res = response.data;            
            return res;
          }, function failureFunction(response){
            return false;
          });
    };

    return {
      getGeoLocation: getGeoLocation    
    };

  }]);
