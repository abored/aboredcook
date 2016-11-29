angular.module('userController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('user', {
                    url: '/user/{username}',
                    templateUrl: 'angular/user/user.html',
                    controller: 'UserCtrl',
                    resolve: {
                        user: ['$stateParams', 'Users', function($stateParams, Users) {
                            return Users.getUserByUsername($stateParams.username);
                        }]
                    }
                })
        }
    ])
    .controller('UserCtrl', [
        '$scope',
        'user',
        'Auth',
        function($scope, user, Auth) {
            $scope.user = user;
            $scope.isLoggedIn = Auth.isLoggedIn();
            $scope.listCollapsed = true;
            $scope.favsCollapsed = true;
        }
    ])
