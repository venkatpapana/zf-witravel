'use strict';

angular.module('ngWitravelApp')
    .directive('flightTile', function () {
        return {
            restrict: 'E',
            scope: {
                flight: '=thisflight'
            },
            templateUrl: 'partials/flight_tile.html'
        };
    });
