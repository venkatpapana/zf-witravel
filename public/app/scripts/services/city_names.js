'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelImagesService
 * @description
 * # hotelImagesService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('cityNamesService', ['$http', function ($http) {
    
    var cityNameCodes = {};

    var arrCityCodeNames = {
      'AMS': 'Amsterdam',
      'BER': 'Berlin',
      'BCN': 'Barcelona',
      'LON': 'London',
      'CPH': 'Copenhagen',
      'PAR': 'Paris',
      'IST': 'Istanbul',
      'BRU': 'Brussels',
      'AGP': 'Malaga',
      'ROM': 'Rome',
      'KRK': 'Krakow',
      'TLL': 'Tallin',
      'LIS': 'Lisbon'
      /*'SEN': 'SEN',
      'LTN': 'LTN',
      'LGW': 'LGW',
      'SFX': 'SFX'*/
    };


    var cityCodeAlias = {
      'RTM': 'AMS', 'EIN': 'AMS', 'DUS': 'AMS', 
      'SXF': 'BER', 'THF': 'BER', 'TXL': 'BER',
      'BLA': 'BCN', 'GRO': 'BCN', 
      'LCY': 'LON', 'LGW': 'LON', 'LHR': 'LON', 'LOZ': 'LON', 'STN': 'LON', 'LTN': 'LON', 
      'MMX': 'CPH', 
      'LBG': 'PAR', 'ORY': 'PAR', 'PHT': 'PAR', 'PRX': 'PAR', 'XCR': 'PAR', 'CDG': 'PAR',
      'SAW': 'IST', 
      'ANR': 'BRU', 'CRL': 'BRU', 
      'GRX': 'AGP', 'GIB': 'AGP', 'SVQ': 'AGP', 
      'CIA': 'ROM', 'FCO': 'ROM', 'PEG': 'ROM', 
      'KTW': 'KRK', 
      'HEL': 'TLL', 'TAY': 'TLL', 'TKU': 'TLL',
      'FAO': 'LIS'
    };


    // $http.get('city_names_codes.json')
    //   .then(function(res) {
    //     cityNameCodes = res.data;                
    // });

  	var getCityNameForCode = function(code) {
      if(arrCityCodeNames[code] != undefined) {
        return arrCityCodeNames[code];
      }else if(cityCodeAlias[code] != undefined) {
        return getCityNameForCode(cityCodeAlias[code])
      }else{
        return code;
      }      
  	};

    var getCityCodeForName = function(name) {
      if(cityNameCodes[name] != undefined && cityNameCodes[name] != null) {
          return cityNameCodes[name];
      }else{
        return 'UNKNOWN';
      }
    };




    return {
      getCityNameForCode: getCityNameForCode      
    };

  }]);    