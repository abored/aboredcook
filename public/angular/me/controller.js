angular.module('meController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('me', {
                    url: '/me',
                    templateUrl: 'angular/me/me.html',
                    controller: 'MeCtrl',
                    resolve: {
                        user: ['Users', function(Users) {
                            return Users.getCurrentUser();
                        }]
                    }

                })
                .state('me.edit', {
                    url: '/edit',
                    templateUrl: 'templates/me.edit.html',

                })
        }
    ])
    .controller('MeCtrl', [
        '$scope',
        '$state',
        'user',
        'Users',
        'Recipes',
        'Auth',
        '$window',
        function($scope, $state, user, Users, Recipes, Auth, $window) {
            $scope.user = user;
            $scope.isLoggedIn = Auth.isLoggedIn();

            $scope.confirmDelete = function(title, id) {
                if ($window.confirm("Vil du slette " + title)) {
                    Recipes.delete(id);
                    $state.reload();
                }
            }

            $scope.submit = function() {
                Users.editUser($scope.user);
                $state.go('me');
            }
        }
    ])
