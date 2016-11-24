angular.module('meController', []).controller('MeCtrl', [
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
