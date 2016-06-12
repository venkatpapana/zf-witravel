'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('PaymentCtrl', ['$http', '$state', '$timeout', 'wiConfig', 'lowFareSearchService', 'hotelSearchService', 'randomString', 'util',
        function ($http, $state, $timeout, wiConfig, lowFareSearchService, hotelSearchService, randomString, util) {

            var vm = this;


            vm.selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.selectedAirSegment = lowFareSearchService.getSelectedAirSegment();
            vm.selectedHotel = lowFareSearchService.getSelectedHotel();

            vm.startDate = lowFareSearchService.getStartDate(); //Date object
            vm.endDate = lowFareSearchService.getEndDate(); //Date object

            vm.selectedTotalPrice = lowFareSearchService.getSelectedTotalPrice();

            vm.bookingCharges = lowFareSearchService.getBookingCharges();

            vm.transid = randomString(6);
            vm.status = 'authorized';
            vm.amount = '395.00';
            vm.first_name = 'Chetan';
            vm.last_name = 'Kumar';
            vm.email = 'Chetan@gmail.com';
            vm.phone = '000012345';
            vm.maskedcc = '411111******1111';  
            vm.cc_num = '4111111111111111';
            vm.cc_type = 'visa';
            vm.cc_exp_mon = '07';
            vm.cc_exp_year = 's17';
            vm.cc_cvv = '123';


            vm.doPayment = function doPayment() {
                vm.loading = true;
                $timeout(function(){
                    vm.loading = false;
                    $state.go("payment_success");
                }, 2000);
            }
            
        }]);
