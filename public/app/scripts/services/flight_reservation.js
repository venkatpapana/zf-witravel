'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelDetailsService
 * @description
 * # hotelDetailsService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('flightReservationService', ['$http', 'wiConfig', function ($http, wiConfig) {

    var reserveFlight = function(data) {
      return $http({
        method: 'POST',
        url: wiConfig.serviceURL+'/flights/flight-reservation',
        data: data
      });
    };

    return {
      reserveFlight: reserveFlight
    };

  }]);
