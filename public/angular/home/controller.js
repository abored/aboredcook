angular.module('homeController', ['ui.bootstrap', 'ui.router'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'angular/home/home.html',
                    controller: 'HomeCtrl',
                    resolve: {
                        recipes: ['Recipes', function(Recipes) {
                            return Recipes.getAll();
                        }]
                    }
                })

        }
    ])
    .controller('HomeCtrl', [
        '$scope',
        'recipes',
        'Auth',
        function($scope, recipes, Auth) {
            $scope.recipes = recipes.data;
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.slideInterval = 3000;
        }
    ]);
