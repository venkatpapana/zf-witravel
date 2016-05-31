angular.module('ngWitravelApp')
    .filter('displayTime', [function () {
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
    }])
    .filter('cityCode2Name', ['cityNamesService', function (cityNamesService) {
        return function (code) {
            if (code) { //when input is defined the apply filter
                var name = cityNamesService.getCityNameForCode(code);
                if(name == code) {
                    name = cityNamesService.getCityNameForCode(cityNamesService.getCityCodeAlias(code));
                }
                return name;
            }else{
                return code;
            }
        }
    }])

    .filter('cityCodeAlias', ['cityNamesService', function (cityNamesService) {
        return function (code) {
            if (code) { //when input is defined the apply filter
                code = cityNamesService.getCityCodeAlias(code);
            }
            return code;
        }
    }])
    .filter('string2Num', [function () {
        return function (str) {
            if(str) {
                str = str.toString().replace(/,/g, '');
            }
            return parseInt(str, 10);
        };
    }])

    ;
