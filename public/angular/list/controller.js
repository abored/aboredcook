angular.module('listController', []).controller('ListCtrl', [
    '$scope',
    'Recipes',
    function($scope, Recipes) {
        $scope.recipes = Recipes.recipes;
    }
]);
