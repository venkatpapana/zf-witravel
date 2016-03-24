'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:AboutCtrl
 * @description
 * # test service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('LowFareSearchCriteria', [function () {

        var budget = 200, numTravellers = 2;

        var setBudget = function (b) {
            budget = b;
        }

        var getBudget = function () {
            return budget;
        };

        var setNumTravellers = function (n) {
            numTravellers = n;
        }

        var getNumTravellers = function () {
            return numTravellers;
        };


        return {
            setBudget: setBudget,
            getBudget: getBudget,
            setNumTravellers: setNumTravellers,
            getNumTravellers: getNumTravellers
        }
    }]);
