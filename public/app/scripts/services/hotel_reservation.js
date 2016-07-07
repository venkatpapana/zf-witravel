'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelReservationService
 * @description
 * # hotelDetailsService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('hotelReservationService', ['$http', 'wiConfig', function ($http, wiConfig) {
    
    var reserveHotel = function(data) {
      return $http({
        method: 'POST',
        url: wiConfig.serviceURL+'/hotels/hotel-reservation',
        data: data
      });
    };

    return {
      reserveHotel: reserveHotel
    };


  }]);
