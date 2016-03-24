'use strict';

/**
 * @ngdoc function
 * @name ngWitravelApp.controller:AboutCtrl
 * @description
 * # test service
 * Service of the ngWitravelApp
 */
angular.module('ngWitravelApp')
    .service('TestService', ['$http', 'wiConfig', function ($http, wiConfig) {

        return {
            getUserDetails: function () {
                return $http({
                    method: 'GET',
                    url: wiConfig.serviceURL + '/test/hello'
                }).then(function successFunction(response) {
                    return response;
                }, function failureFunction(response) {
                    return response;
                });
            }
        }
    }]);
