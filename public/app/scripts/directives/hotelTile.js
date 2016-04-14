'use strict';

angular.module('ngWitravelApp')
    .directive('hotelTile', function () {
        return {
            restrict: 'E',
            scope: {
                hotel: '='
            },
            templateUrl: 'partials/hotel_tile.html'
        };
    });
