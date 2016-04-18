'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelImagesService
 * @description
 * # hotelImagesService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('hotelImagesService', ['$http', 'wiConfig', function ($http, wiConfig) {
    
    var searchStatus = false, searchResults=null;
    var respResults = [];

    var getHotelImageResults = function(location) {
          return $http({
            method: 'GET',
            url: wiConfig.serviceURL+'/hotels/hotel-images/location/'+location
          }).then(function successFunction(response){
            searchResults = response.data;
            searchStatus = true;
            return searchStatus;
          }, function failureFunction(response){
            return searchStatus;
          });
    };

    var getSavedResults = function() {
      return searchResults;
    };


    // var getAirSegment = function(segKey) {
    //   var airSegment = null;
    //   if(searchResults != null) {
    //     var arrAirSegments = searchResults['AirSegmentList']['AirSegment'];
    //     for (var i = 0; i < arrAirSegments.length; i++) {
    //       if(arrAirSegments[i]['!Key'] == segKey) {
    //         airSegment = arrAirSegments[i];
    //         break;
    //       }
    //     }
    //   }
    //   return airSegment;
    // };


    var getHotelIimages = function() {
      return respResults;
    };

    var parseHotelImages = function() {
      var resHotels = [];

      if(searchResults != null) {
        var airHotelSearchResults = searchResults['HotelSearchResult'];
        if(airHotelSearchResults != undefined && airHotelSearchResults != null && airHotelSearchResults.length == undefined) {
          airHotelSearchResults = [airHotelSearchResults];
        }
        if(airHotelSearchResults.length > 0) {
          for (var i = 0; i < airHotelSearchResults.length; i++) {
            var thisHotelResult = airHotelSearchResults[i];
            if(!thisHotelResult['HotelProperty']['!Availability'] || thisHotelResult['HotelProperty']['!Availability'] != 'Available') {
              continue;
            }

            var objHotelDetails = {};

      			objHotelDetails.Address				= thisHotelResult['HotelProperty']['PropertyAddress']['Address'];
            objHotelDetails.Availability			= thisHotelResult['HotelProperty']['!Availability'];
            objHotelDetails.HotelCode				= thisHotelResult['HotelProperty']['!HotelCode'];
            objHotelDetails.Name					= thisHotelResult['HotelProperty']['!Name'];
            objHotelDetails.ParticipationLevel	= thisHotelResult['HotelProperty']['!ParticipationLevel'];
            objHotelDetails.ReserveRequirement	= thisHotelResult['HotelProperty']['!ReserveRequirement'];

            if((thisHotelResult['RateInfo']['!ApproximateMinimumAmount'])) {
      				objHotelDetails.MinimumAmount			= thisHotelResult['RateInfo']['!ApproximateMinimumAmount'];
      			}else{
      				objHotelDetails.MinimumAmount			= thisHotelResult['RateInfo']['!MinimumAmount'];
      			}
      			if((thisHotelResult['RateInfo']['!ApproximateMaximumAmount'])) {
      				objHotelDetails.MaximumAmount			= thisHotelResult['RateInfo']['!ApproximateMaximumAmount'];
      			}else{
      				objHotelDetails.MaximumAmount			= thisHotelResult['RateInfo']['!MaximumAmount'];
      			}

      			//objHotelDetails.MinimumAmountNum		= preg_replace('/[a-z]/i', '', objHotelDetails.MinimumAmount);
            objHotelDetails.MinimumAmountNum = objHotelDetails.MinimumAmount;
      			//objHotelDetails.TotalMinAmountNum		= number_format(objHotelDetails.MinimumAmountNum * $this->durationNumDays, 2);
            objHotelDetails.TotalMinAmountNum		= objHotelDetails.MinimumAmountNum * 2;

            objHotelDetails.Transportation		= thisHotelResult['HotelProperty']['!HotelTransportation'];



            if(objHotelDetails != null) {
                resHotels.push(objHotelDetails);
            }
          }//for
        } //have AirPricingSolutions
      } //have SearchResults
      respResults = resHotels;
    };

    return {
      setBudget: setBudget,
      getBudget: getBudget,
      setNumTravellers: setNumTravellers,
      getNumTravellers: getNumTravellers,
      getHotelSearchResults: getHotelSearchResults,
      getSavedResults: getSavedResults,
      parseHotels: parseHotels,
      getHotels: getHotels
    };

  }]);