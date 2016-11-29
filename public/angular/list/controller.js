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
                        recipes: ['Recipes', function(Recipes) {
                            return Recipes.getAll();
                        }]
                    }
                })
        }
    ])
    .controller('ListCtrl', [
        '$scope',
        'recipes',
        function($scope, recipes) {
            $scope.recipes = recipes.data;
            $scope.sortType = 'createdAt'; // set the default sort type
            $scope.sortReverse = false;  // set the default sort order
        }
    ]);
