var app = angular.module('cookbook', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    recipePromise: ['recipes', function(recipes) {
                        return recipes.getAll();
                    }]
                }
            })
            .state('recipes', {
                url: '/recipes/{id}',
                templateUrl: '/recipes.html',
                controller: 'RecipesCtrl',
                resolve: {
                    recipe: ['$stateParams', 'recipes', function($stateParams, recipes) {
                        return recipes.get($stateParams.id);
                    }]
                }
            });

    }
]);

app.factory('recipes', ['$http', function($http) {
    var o = {
        recipes: []
    };
    o.getAll = function() {
        return $http.get('/recipes').success(function(data) {
            angular.copy(data, o.recipes);
        });
    };
    o.get = function(id) {
        return $http.get('/recipes/' + id).then(function(res) {
            return res.data;
        });
    };
    o.create = function(recipe) {
        return $http.post('/recipes', recipe).success(function(data) {
            o.recipes.push(data);
        });
    };
    o.addComment = function(id, comment) {
        return $http.post('/recipes/' + id + '/comments', comment);
    };
    o.upvote = function(recipe) {
        return $http.put('/recipes/' + recipe._id + '/upvote')
            .success(function(data) {
                recipe.upvotes += 1;
            });
    };
    o.upvoteComment = function(recipe, comment) {
        return $http.put('/recipes/' + recipe._id + '/comments/' + comment._id + '/upvote')
            .success(function(data) {
                comment.upvotes += 1;
            });
    };
    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'recipes',
    function($scope, recipes) {
        $scope.recipes = recipes.recipes;
        $scope.addrecipe = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            recipes.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function(recipe) {
            recipes.upvote(recipe);
        };
    }

]);

app.controller('RecipesCtrl', [
    '$scope',
    'recipes',
    'recipe',
    function($scope, recipes, recipe) {
        $scope.recipe = recipe;
        $scope.addComment = function() {
            if ($scope.body === '') {
                return;
            }
            recipes.addComment(recipe._id, {
                body: $scope.body,
                author: 'user',
            }).success(function(comment) {
                $scope.recipe.comments.push(comment);
            });
            $scope.incrementUpvotes = function(comment) {
                recipes.upvoteComment(recipe, comment);
            };
            $scope.body = '';
        };
    }
]);
