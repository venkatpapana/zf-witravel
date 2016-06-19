'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('HotelsCtrl', ['$http', '$state', '$q', 'wiConfig', 'lowFareSearchService', 'hotelSearchService', 'hotelImagesService', 'util', 'cityNamesService',
        function ($http, $state, $q, wiConfig, lowFareSearchService, hotelSearchService, hotelImagesService, util, cityNamesService) {

            var vm = this;
            vm.hotelImages = {};

            var hotels = [];

            var hotelSelected = function (hotel) {
                lowFareSearchService.setSelectedHotel(hotel);
                vm.selectedHotelPrice = util.string2Num(hotel['TotalMinAmountNum']);
                vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
            };
            
            var redirectToPayment = function(hotel) {
                hotelSelected(hotel);
                $state.go('payment');  
            };

            vm.budgetChange = function() {

                lowFareSearchService.setBudget(vm.budget);
                refreshHotels();            
            };

           vm.distanceChange = function() {

                lowFareSearchService.setDistance(vm.distance);
                refreshHotels();                
            };  

            function successFunction()  {

                vm.loading = false;
                // var hotelImages = hotelImagesService.getCachedResults();

                // for (var j = hotelImages.length - 1; j >= 0; j--) {
                //     hotelImages[hotelImages[j]['HotelCode']] = hotelImages[j];
                // }
                for (var i = hotels.length - 1; i >= 0; i--) {
                    hotels[i]['images'] = hotelImagesService.getCachedResultsForHotel(hotels[i]['HotelCode']);
                }
                vm.hotels = hotels;
                hotelSearchService.updateRelativePricings(vm.hotels);

            }

//             function successFunction()  {
//                 vm.loading = false;

//                 // vm.hotelImages = hotelImagesService.getCachedResults();

//                 // for (var j = vm.hotelImages.length - 1; j >= 0; j--) {
//                     for (var i = vm.hotels.length - 1; i >= 0; i--) {
//                         // if(parseInt(vm.hotels[i].HotelCode) == parseInt(vm.hotelImages[j]['HotelCode'])) {
// // console.log("====== i="+i);                            
//                             // vm.hotels[i]['images'] = {'images': 
//                             //     [{'!url': 'https://d2whcypojkzby.cloudfront.net/imageRepo/2/0/48/294/890/044546_SHR_Amsterdam_Airport_rooms_Senator__J.jpg'},
//                             //     {'!url': 'https://d2whcypojkzby.cloudfront.net/imageRepo/2/0/48/294/890/044546_SHR_Amsterdam_Airport_rooms_Senator__J.jpg'}]
//                             // }; 
//                             vm.hotels[i]['images'] = hotelImagesService.getCachedResults(vm.hotels[i].HotelCode);
//                             // break;                     
//                         // }
//                     }
//                 // }              
//             }  

            function failureFunction() {
                vm.loading = false;
            }                   

            var refreshHotels = function() {
                // vm.airSegments = lowFareSearchService.filterResults();
                // // vm.selectedDestAirSegments = lowFareSearchService.getFlights(vm.selectedDestination);
                // if(vm.airSegments.length > 0) {
                //     for (var i = vm.airSegments.length - 1; i >= 0; i--) {
                //         if(vm.airSegments[i]['destination'] == vm.selectedDestination) {
                //             vm.hotels = vm.airSegments[i]['hotels'];
                //             break;
                //         }
                //     }
                // }else{
                //     vm.hotels = [];
                // }
                // util.sortObjects(vm.hotels, 'TotalMinAmountNum');
                vm.hotels = [];
                
                vm.selectedDestAirSegments = lowFareSearchService.getFlightsForDestination(vm.selectedDestination);
                if(vm.selectedDestAirSegments) {
                    hotels = vm.selectedDestAirSegments['hotels'];
                }

                //TODO:

                var hotelImgPromises = []; 
                vm.loading = true;
                for (var i = hotels.length - 1; i >= 0; i--) {
                    var hotel = hotels[i];
                    
                    hotelImgPromises.push(hotelImagesService.getHotelImageResults(hotel.HotelCode));

                    // default hotel image
                    // hotel['carouselIndex'] = 0;
                    // hotel['images'] = [
                    //     {'!url': 'https://d2whcypojkzby.cloudfront.net/imageRepo/2/0/48/294/890/044546_SHR_Amsterdam_Airport_rooms_Senator__J.jpg'},
                    //     {'!url': 'https://d2whcypojkzby.cloudfront.net/imageRepo/2/0/48/294/890/044546_SHR_Amsterdam_Airport_rooms_Senator__J.jpg'}
                    // ];
                    // vm.hotels[i] = hotel;
                };
                $q.all(hotelImgPromises).then(successFunction, failureFunction);


                
            };

            // vm.selectedTotalPrice = 0;
            vm.hotelSelected = hotelSelected;    
            vm.redirectToPayment = redirectToPayment;    
                    
            vm.budget = lowFareSearchService.getBudget();
            vm.distance = lowFareSearchService.getDistance();

            vm.startDate = lowFareSearchService.getStartDate(); //Date object
            vm.endDate = lowFareSearchService.getEndDate(); //Date object                    

            vm.selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.selectedAirSegment = lowFareSearchService.getSelectedAirSegment();
            vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();
            // vm.loading = true;
            // hotelSearchService.getHotelSearchResults(selectedDestination).then(successFunction, failureFunction);
            // var cached = hotelSearchService.getParsedCacheResults()
            // vm.hotels = cached[cityNamesService.getCityCodeAlias(vm.selectedDestination)];
            // console.log("cache.hotels", vm.hotels);
            refreshHotels();
            if(!lowFareSearchService.getSelectedHotel() && vm.hotels && vm.hotels.length > 0) {
                hotelSelected(vm.hotels[0]);
            }
            
            // util.sortObjects(vm.hotels, 'TotalMinAmountNum');
            // hotelSearchService.updateRelativePricings(vm.hotels);

}]);
