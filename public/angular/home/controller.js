angular.module('homeController', ['ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'angular/home/home.html',
                    controller: 'HomeCtrl'
                })
        }
    ])
    .controller('HomeCtrl', [
        '$scope',
        'Recipes',
        'Auth',
        function($scope, Recipes, Auth) {
            $scope.recipes = Recipes.recipes;
            $scope.isLoggedIn = Auth.isLoggedIn;
        }
    ]);
