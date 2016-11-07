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
            })

        .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });
    }
]);

app.factory('recipes', ['$http', 'auth', function($http, auth) {
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
        return $http.post('/recipes', recipe, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).success(function(data) {
            o.recipes.push(data);
        });
    };
    o.addComment = function(id, comment) {
        return $http.post('/recipes/' + id + '/comments', comment, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        });
    };
    o.upvote = function(recipe) {
        return $http.put('/recipes/' + recipe._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function() {
                recipe.upvotes += 1;
            });
    };
    o.upvoteComment = function(recipe, comment) {
        return $http.put('/recipes/' + recipe._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function() {
                comment.upvotes += 1;
            });
    };
    return o;
}]);

app.factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};
    auth.saveToken = function(token) {
        $window.localStorage['cookbook-token'] = token;
    };

    auth.getToken = function() {
        return $window.localStorage['cookbook-token'];
    };

    auth.isLoggedIn = function() {
        var token = auth.getToken();

        if (token) {
            return true;
        } else {
            return false;
        }
    };

    auth.currentUser = function() {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('cookbook-token');
    };

    return auth;
}])
app.controller('MainCtrl', [
    '$scope',
    'recipes',
    'auth',
    function($scope, recipes, auth) {
        $scope.recipes = recipes.recipes;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addRecipe = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            recipes.create({
                title: $scope.title,
                ingredients: $scope.ingredients
            });
            $scope.title = '';
            $scope.ingredients = '';
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
    'auth',
    function($scope, recipes, recipe, auth) {
        $scope.recipe = recipe;
        $scope.isLoggedIn = auth.isLoggedIn;

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

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function() {
            auth.register($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home');
            });
        };

        $scope.logIn = function() {
            auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home');
            });
        };
    }
])

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);
