'use strict';

angular.module('ngWitravelApp')
.directive('loading', function () {
      return {
        restrict: 'E',
        scope: {
            loading : '=loading'
        },
        replace:true,
        template: '<div class="loading">LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });