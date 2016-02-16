'use strict';

/**
 * @ngdoc overview
 * @name ngWitravelApp
 * @description
 * # ngWitravelApp
 *
 * Main module of the application.
 */
angular
  .module('ngWitravelApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    /**
     *  Routes
     */
    // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise("/home");

      $stateProvider
          .state('home', {
            url: "/",
            templateUrl: "views/main.html",
            controller: 'MainCtrl',
            controllerAs: 'main'
          })
          .state('about', {
            url: "/about",
            templateUrl: "views/about.html",

            controllerAs: 'about'
          });





    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl',
    //     controllerAs: 'main'
    //   })
    //   .when('/about', {
    //     templateUrl: 'views/about.html',
    //     controller: 'AboutCtrl',
    //     controllerAs: 'about'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });
  })
  .constant("wiConfig", {
     "env": "local",
          "serviceURL": "/zf-witravel/public/",
  });;
