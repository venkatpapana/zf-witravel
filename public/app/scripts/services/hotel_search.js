'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelSearchService
 * @description
 * # hotelSearchService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('hotelSearchService', ['$http', 'wiConfig', function ($http, wiConfig) {
        var budget = 200, numTravellers = 2, twoWay = true;
        var searchStatus = false, searchResults = null;
        var respResults = [];

        var reservationResult = null, reservationStatus = false;

        var setBudget = function (b) {
            budget = b;
        }

        var getBudget = function () {
            return budget;
        };

        var setNumTravellers = function (n) {
            numTravellers = n;
        };

        var getNumTravellers = function () {
            return numTravellers;
        };


        var getHotelSearchResults = function (location) {
            return $http({
                method: 'GET',
                url: wiConfig.serviceURL + '/hotels/hotel-search/location/' + location + '/adults/' + getNumTravellers() + '/startDate/' + '' + '/endDate/'
            }).then(function successFunction(response) {
                searchResults = response.data;
                searchStatus = true;
                return searchStatus;
            }, function failureFunction(response) {
                return searchStatus;
            });
        };

        var getSavedResults = function () {
            return searchResults;
        };


        var getHotels = function () {
            return respResults;
        };

        var parseHotels = function () {
            var resHotels = [];

            if (searchResults != null) {
                var airHotelSearchResults = searchResults['HotelSearchResult'];
                if (airHotelSearchResults != undefined && airHotelSearchResults != null && airHotelSearchResults.length == undefined) {
                    airHotelSearchResults = [airHotelSearchResults];
                }
                if (airHotelSearchResults.length > 0) {
                    for (var i = 0; i < airHotelSearchResults.length; i++) {
                        var thisHotelResult = airHotelSearchResults[i];
                        if (!thisHotelResult['HotelProperty']['!Availability'] || thisHotelResult['HotelProperty']['!Availability'] != 'Available') {
                            continue;
                        }


                        var objHotelDetails = {};


                        objHotelDetails.Address = thisHotelResult['HotelProperty']['PropertyAddress']['Address'];
                        objHotelDetails.Availability = thisHotelResult['HotelProperty']['!Availability'];
                        objHotelDetails.HotelCode = thisHotelResult['HotelProperty']['!HotelCode'];
                        objHotelDetails.Name = thisHotelResult['HotelProperty']['!Name'];
                        objHotelDetails.ParticipationLevel = thisHotelResult['HotelProperty']['!ParticipationLevel'];
                        objHotelDetails.ReserveRequirement = thisHotelResult['HotelProperty']['!ReserveRequirement'];

                        if ((thisHotelResult['RateInfo']['!ApproximateMinimumAmount'])) {
                            objHotelDetails.MinimumAmount = thisHotelResult['RateInfo']['!ApproximateMinimumAmount'];
                        } else {
                            objHotelDetails.MinimumAmount = thisHotelResult['RateInfo']['!MinimumAmount'];
                        }
                        if ((thisHotelResult['RateInfo']['!ApproximateMaximumAmount'])) {
                            objHotelDetails.MaximumAmount = thisHotelResult['RateInfo']['!ApproximateMaximumAmount'];
                        } else {
                            objHotelDetails.MaximumAmount = thisHotelResult['RateInfo']['!MaximumAmount'];
                        }

                        //objHotelDetails.MinimumAmountNum		= preg_replace('/[a-z]/i', '', objHotelDetails.MinimumAmount);
                        objHotelDetails.MinimumAmountNum = objHotelDetails.MinimumAmount;
                        //objHotelDetails.TotalMinAmountNum		= number_format(objHotelDetails.MinimumAmountNum * $this->durationNumDays, 2);
                        objHotelDetails.TotalMinAmountNum = objHotelDetails.MinimumAmountNum * 2;

                        objHotelDetails.Transportation = thisHotelResult['HotelProperty']['!HotelTransportation'];


                        if (objHotelDetails != null) {
                            resHotels.push(objHotelDetails);
                        }
                    }//for
                } //have AirPricingSolutions
            } //have SearchResults
            respResults = resHotels;
        };




        var getSavedResults = function () {
            return searchResults;
        };


        var requestHotelReservation = function (location) {
            return $http({
                method: 'GET',
                url: wiConfig.serviceURL + '/hotels/hotel-reservation/location/' + location + '/adults/' + getNumTravellers() + '/startDate/' + '' + '/endDate/'
            }).then(function successFunction(response) {
                reservationResult = response.data;
                reservationStatus = true;
                return reservationStatus;
            }, function failureFunction(response) {
                return reservationStatus;
            });
        };


        var getHoltelReservationResult = function getHoltelReservationResult(location) {
            if (reservationResult != null && reservationResult.UniversalRecord !== undefined) {
                return reservationResult;
            }else{
                return getNewHoltelReservationResult(location);
            }
        }

        var getNewHoltelReservationResult = function getNewHoltelReservationResult(location) {
            requestHotelReservation(location).then(function() {
                parseReservationResult();
                return reservationStatus;
            }, 
            function(){
                return false;
            });
            
        }        

        var parseReservationResult = function() {
            if (reservationResult != null) {

                if(reservationResult.UniversalRecord !== undefined && 
                    reservationResult.UniversalRecord.HotelReservation !== undefined && 
                    reservationResult.UniversalRecord.HotelReservation['!Status'] !== undefined) {

                    reservationStatus = reservationResult['UniversalRecord']['HotelReservation']['!Status'];
                    var providerLocatorCode = reservationResult['UniversalRecord']['ProviderReservationInfo']['!LocatorCode'];   
                }else {
                    //TODO:
                }                

            }

        };





        return {
            setBudget: setBudget,
            getBudget: getBudget,
            setNumTravellers: setNumTravellers,
            getNumTravellers: getNumTravellers,
            getHotelSearchResults: getHotelSearchResults,
            getSavedResults: getSavedResults,
            parseHotels: parseHotels,
            getHotels: getHotels,
            getHoltelReservationResult: getHoltelReservationResult,
            getNewHoltelReservationResult: getNewHoltelReservationResult
        };

    }//service function

    ]);