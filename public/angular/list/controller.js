angular.module('listController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
            .state('list', {
                url: '/list',
                templateUrl: 'angular/list/recipelist.html',
                controller: 'ListCtrl',
                resolve: {
                    recipesPromise: ['Recipes', function(Recipes) {
                        return Recipes.getAll();
                    }]
                }
            })
        }
    ])
    .controller('ListCtrl', [
        '$scope',
        'Recipes',
        function($scope, Recipes) {
            $scope.recipes = Recipes.recipes;
        }
    ]);
