'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:hotelImagesService
 * @description
 * # hotelImagesService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('cityNamesService', [function () {
    

  	var getCityName = function(code) {
  		if(code === 'TXL') {
  			return 'Berlin';
  		}else if(code === 'BCN') {
			return 'Barcelona';
  		}else if(code === 'LTN') {
			return 'London';
  		}else if(code === 'CPH') {
			return 'Copenhagen';
  		}else if(code === 'SAW') {
			return 'Istanbul';
  		}else if(code === 'SXF') {
			return 'Schonefeld';
  		}else{
  			return code;
  		}
  	}


    return {
      getCityName: getCityName      
    };

  }]);    