'use strict';

angular.module('ngWitravelApp')
.directive('flightTile', function() {
  return {
    restrict: 'E',
    scope: {
      flight: '='
    },
    templateUrl: 'partials/flight_tile.html'
  };
});
