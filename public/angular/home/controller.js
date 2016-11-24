angular.module('homeController', []).controller('HomeCtrl', [
    '$scope',
    'Recipes',
    'Auth',
    function($scope, Recipes, Auth) {
        $scope.recipes = Recipes.recipes;
        $scope.isLoggedIn = Auth.isLoggedIn;
    }
]);
