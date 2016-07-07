'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:HotelsCtrl
 * @description
 * # HotelsCtrl
 * Controller of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .controller('PaymentCtrl', ['$http', '$state', '$timeout', '$q', 'wiConfig', 
                'lowFareSearchService', 'hotelSearchService', 'randomString', 'util', 'flightReservationService', 'hotelReservationService',
        function ($http, $state, $timeout, $q, wiConfig, 
                    lowFareSearchService, hotelSearchService, randomString, util, flightReservationService, hotelReservationService) {

            var vm = this;
            vm.data = {};

            vm.data.selectedDestination = lowFareSearchService.getSelectedDestination();
            vm.data.selectedAirSegment  = lowFareSearchService.getSelectedAirSegment();
            vm.data.selectedHotel       = lowFareSearchService.getSelectedHotel();
            vm.data.startDate           = lowFareSearchService.getStartDate(); //Date object
            vm.data.endDate             = lowFareSearchService.getEndDate(); //Date object
            vm.data.startDateStr        = util.convertDate2PhpString(lowFareSearchService.getStartDate()); //Date object
            vm.data.endDateStr          = util.convertDate2PhpString(lowFareSearchService.getEndDate()); //Date object
            vm.data.selectedTotalPrice  = lowFareSearchService.getSelectedTotalPrice();
            vm.data.bookingCharges      = lowFareSearchService.getBookingCharges();

            vm.data.transid     = randomString(6);
            vm.data.status      = 'authorized';
            vm.data.amount      = '395.00';
            vm.data.title       = 'Mr';
            vm.data.first_name  = 'Chetan';
            vm.data.last_name   = 'Kumar';
            vm.data.email       = 'Chetan@gmail.com';
            vm.data.phone       = '000012345';

            vm.data.maskedcc    = '411111******1111';  
            vm.data.cc_num      = '4111111111111111';
            vm.data.cc_type     = 'VI';
            vm.data.cc_exp_mon  = '07';
            vm.data.cc_exp_year = '2017';
            vm.data.cc_cvv      = '123';

            vm.data.age             = 40;
            vm.data.dob             = '1976-01-21';
            vm.data.gender          = 'M';
            vm.data.nationality     = 'US';
            vm.data.phone_location  = 'DEN';
            vm.data.phone_countryCode = 1;
            vm.data.phone_areaCode  = 303;


            vm.data.addr_name       = 'DemoSiteAddress';
            vm.data.addr_street     = 'Via Augusta 59 5';
            vm.data.addr_city       = 'Madrid';
            vm.data.addr_state      = 'IA';
            vm.data.addr_postalCode = 50156
            vm.data.addr_country    = 'US';

            vm.data.ship_addr_name          = 'DemoSiteAddress';
            vm.data.ship_addr_street        = 'Via Augusta 59 5';
            vm.data.ship_addr_city          = 'Madrid';
            vm.data.ship_addr_state         = 'IA';
            vm.data.ship_addr_postalCode    = 50156
            vm.data.ship_addr_country       = 'US';

            var reserveFlight = function() {
                console.log('inside reserveFlight func.');

                return flightReservationService.reserveFlight(vm.data);

                // var deffered = $q.defer();
                // console.log('');
                // $timeout(function(){
                //     console.log('reserveFlight is done.');
                //     deffered.resolve({'status': true, 'msg': 'reserveFlight is done'});
                // }, 2000);

                // return deffered.promise;
            };

            var reserveHotel = function() {
                console.log('inside reserveHotel func.');

                return hotelReservationService.reserveHotel(vm.data);
                // var deffered = $q.defer();

                // $timeout(function(){
                //     console.log('reserveHotel is done.');
                //     deffered.resolve({'status': true, 'msg': 'reserveHotel is done'});
                // }, 2000);

                // return deffered.promise;
            };

            function reservationFailed(response) {
                vm.loading = false;
                alert(response);
                console.log(response);
                //TODO: calcellation process
            }


            vm.doPayment = function doPayment() {
                vm.loading = true;
                console.log('calling reserveFlight func...');
                reserveFlight().then(function(response) {
                    console.log('reserveFlight response', response);
                    if(response.data && response.data.faultcode == undefined) {
                        reserveHotel().then(function(response) {
                            console.log('reserveHotel response', response.data);
                            if(response.data && response.data.faultcode == undefined) {
                                $timeout(function() {
                                    vm.loading = false;
                                    $state.go("payment_success");
                                }, 2000);                                
                            }else{
                                reservationFailed(response.data.faultstring);
                            }

                        },function(response) {
                            reservationFailed(response);
                        });
                    }else{
                        reservationFailed(response.data.faultstring);
                    }
                },function(response) {
                    reservationFailed(response);
                });
            };

            // vm.reserveFlight = reserveFlight;
            // vm.reserveHotel = reserveHotel;
            
        }]);
