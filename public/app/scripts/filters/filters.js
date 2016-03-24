angular.module('ngWitravelApp')
    .filter('displayTime', function () {

        /**
         *  2016-04-20T23:55:00.000+02:00
         *  returns 23:55
         */
        return function (input) {
            if (input) { //when input is defined the apply filter
                input = input.substring(11, 16);
            }
            return input;
        }
    });
