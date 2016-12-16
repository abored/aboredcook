angular.module('navController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
            .state('search', {
                url: '/search/{string}',
                templateUrl: 'angular/nav/search.html',
                controller: 'NavCtrl',
                resolve: {
                    found: ['$stateParams', 'Search', function($stateParams, Search) {
                        return Search.find($stateParams.string);
                    }]
                }
            })
        }
    ])
    .controller('NavCtrl', [
        '$scope',
        '$stateParams',
        'Auth',
        'Search',
        function($scope, $stateParams, Auth, found) {
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.currentUser = Auth.currentUser;
            $scope.logOut = Auth.logOut;

            $scope.sortType = 'createdAt'; // set the default sort type
            $scope.sortReverse = false;  // set the default sort order

            $scope.results = found.results;
        }
    ])
