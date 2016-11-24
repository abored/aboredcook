angular.module('recipeController', []).controller('RecipeCtrl', [
    '$scope',
    '$timeout',
    'Upload',
    'Recipes',
    'recipe',
    'Auth',
    'user',
    '$state',
    function($scope, $timeout, Upload, Recipes, recipe, Auth, user, $state) {
        $scope.recipe = recipe;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.user = user;
        $scope.bigImage = recipe.images[0];
        //console.log($scope.img1);

        //func der undersøger om bruger har fav. recipe, og sætter mdfavorite (se button i UI)
        $scope.checkFav = function() {
          $scope.mdfavorite = "favorite_border";
            for (var i = 0, length = user.favorites.length; i < length; i++) {
                if (user.favorites[i]._id === recipe._id) {
                    $scope.mdfavorite = "favorite";
                }
            }
        }

        //foretag check/instansiate mdfavorite
        $scope.checkFav();

        //affyres når bruger trykker på hjertet
        $scope.favorite = function() {
            Recipes.favorite(recipe._id).success(function(res) {
                console.log(res);
            }).then(function() {
                return $timeout(function() { //timeout FTW (fuck state.reload - se: https://mwop.net/blog/2014-05-08-angular-ui-router-reload.html) - only took me 10 hours to fix, k
                    $state.go('.', {}, {
                        reload: true
                    });
                }, 0);
            });
        };

        $scope.addComment = function() {
            if (!$scope.body) {
                return;
            }
            Recipes.addComment(recipe._id, {
                body: $scope.body,
                author: 'user',
            }).success(function(comment) {
                $scope.recipe.comments.push(comment);
            });
            $scope.incrementUpvotes = function(comment) {
                Recipes.upvoteComment(recipe, comment);
            };
            $scope.body = '';
        };

        $scope.imageClick = function(image) {
            console.log(image);
            $scope.bigImage = image;
            //  console.log($scope.bigImage);
        };
    }
]);
