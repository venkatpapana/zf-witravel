'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:geolocationService
 * @description
 * # geolocationService service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('util', [function () {
    
    var res=null;
    var sortObjects = function(arrObjects, key) {
        // for (var i = arrObjects.length - 1; i >= 0; i--) {
        //   arrObjects[i]
        // };
        arrObjects.sort(function(a, b) {
            return a[key] < b[key];
        });
    };


    return {
      sortObjects: sortObjects
    }
  }]);
