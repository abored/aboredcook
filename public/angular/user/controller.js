angular.module('userController', []).controller('UserCtrl', [
    '$scope',
    'user',
    'Auth',
    function($scope, user, Auth) {
        $scope.user = user;
        console.log(user);
        $scope.isLoggedIn = Auth.isLoggedIn();
    }
])
