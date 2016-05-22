'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.service:util
 * @description
 * # util service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
  .service('util', [function () {
    
    var res=null;
    var sortObjects = function(arrObjects, key) {
        arrObjects.sort(function(a, b) {
          var x = parseInt(a[key]), 
              y = parseInt(b[key])
          // console.log(x + ' > ' + y +' --> '+(x > y));
          return x - y;
        });
    };


    return {
      sortObjects: sortObjects
    }
  }]);
