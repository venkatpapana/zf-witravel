'use strict';

angular.module('ngWitravelApp')
    .directive('hotelTile', function () {
        return {
            restrict: 'E',
            scope: {
                hotel: '=',
                hotelImages: '=?',
                'hotelSelected': '&onSelected',
                'redirectToPayment': '&gotoPayment',
            },
            templateUrl: 'partials/hotel_tile.html',
     //        controller: ['hotelSearchService', function(hotelSearchService) {
     //        	this.hotelSelected = function(hotel) {
     //        		// console.log(hotel);
					// hotelSearchService.getHoltelReservationResult(hotel.HotelCode);
     //        	}
     //        }],
           	controllerAs: "vm"           	
        };
});
