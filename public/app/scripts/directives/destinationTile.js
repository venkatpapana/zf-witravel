'use strict';

angular.module('ngWitravelApp')
.directive('destinationTile', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/destination_tile.html'
  };
});
