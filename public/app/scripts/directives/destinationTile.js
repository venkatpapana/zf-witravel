'use strict';

angular.module('ngWitravelApp')
.directive('destinationTile', function() {
  return {
    restrict: 'E',
    scope: {
      dest: '='
    },
    templateUrl: 'partials/destination_tile.html'
  };
});
