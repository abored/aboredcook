angular.module('authController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'angular/auth/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'Auth', function($state, Auth) {
                        if (Auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'angular/auth/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'Auth', function($state, Auth) {
                        if (Auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                })
        }
    ])
    .controller('AuthCtrl', [
        '$scope',
        '$state',
        'Auth',
        function($scope, $state, Auth) {
            $scope.user = {};

            $scope.register = function() {
                Auth.register($scope.user).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    $state.go('home');
                });
            };

            $scope.logIn = function() {
                Auth.logIn($scope.user).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    $state.go('home');
                });
            };
        }
    ])
