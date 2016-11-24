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
                    results1: ['$stateParams', 'search', function($stateParams, search) {
                        console.log($stateParams.string);
                        return search.find($stateParams.string);
                    }]
                }
            })
        }
    ])
    .controller('NavCtrl', [
        '$scope',
        'Auth',
        'search',
        function($scope, Auth, search) {
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.currentUser = Auth.currentUser;
            $scope.logOut = Auth.logOut;
            $scope.results = search.results;

            $scope.search = function() {
                // Tjek om searchText er tom eller ej
                if ($scope.searchText || !$scope.searchText === '') {
                    // der var noget i den, send request til factory
                    search.find($scope.searchText, function(err, docs) {
                        if (err)
                            return err;
                        // sæt recipes i scope til de returnerede dokumenter (recipes)
                        $scope.result = docs;
                    });
                } else {
                    $scope.result = "none found";
                }
            };
        }

    ])
