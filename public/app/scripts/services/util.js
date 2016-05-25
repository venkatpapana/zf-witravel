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

    var nextDayofWeekDate = function nextDayofWeekDate(dayOfWeek) {
      var ret = new Date();
      ret.setDate(ret.getDate() + (dayOfWeek - 1 - ret.getDay() + 7) % 7 + 1);      
      return ret;
    };

    var convertDate2JsString = function(objDate) {
      var res = objDate.getMonth()+1+'/'+objDate.getDate()+'/'+objDate.getFullYear();
      return res;
      // var arrDate = strDate.split("/");
      // return arrDate[2]+'-'+arrDate[0]+'-'+arrDate[1];
    };

    var convertDate2PhpString = function(objDate) {
      var res = objDate.getFullYear()+'-'+("0" + (objDate.getMonth() + 1)).slice(-2)+'-'+("0" + objDate.getDate()).slice(-2);
      return res;
      // var arrDate = strDate.split("/");
      // return arrDate[2]+'-'+arrDate[0]+'-'+arrDate[1];
    };

    return {
      sortObjects: sortObjects,
      nextDayofWeekDate: nextDayofWeekDate,
      convertDate2JsString: convertDate2JsString,
      convertDate2PhpString: convertDate2PhpString
    }
  }]);
