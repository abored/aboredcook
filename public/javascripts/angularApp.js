var app = angular.module('cookbook', ['ui.router', 'ngMaterial', 'ngFileUpload']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'MainCtrl'
            })
            .state('recipes', {
                url: '/recipes/{id}',
                templateUrl: 'templates/recipes.html',
                controller: 'RecipesCtrl',
                resolve: {
                    recipe: ['$stateParams', 'recipes', function($stateParams, recipes) {
                        return recipes.get($stateParams.id);
                    }],
                    user: ['users', function(users) {
                        return users.getCurrentUser();
                    }]
                }
            })
            .state('list', {
                url: '/list',
                templateUrl: 'templates/recipelist.html',
                controller: 'ListCtrl',
                resolve: {
                    recipesPromise: ['recipes', function(recipes) {
                        return recipes.getAll();
                    }]
                }
            })
            .state('create', {
                url: '/create',
                templateUrl: 'templates/create.html',
                controller: 'CreateCtrl',
                resolve: {
                    user: ['users', function(users) {
                        return users.getCurrentUser();
                    }]
                }
            })
            .state('search', {
                url: '/search/{string}',
                templateUrl: 'templates/search.html',
                controller: 'NavCtrl',
                resolve: {
                    results1: ['$stateParams', 'search', function($stateParams, search) {
                        console.log($stateParams.string);
                        return search.find($stateParams.string);
                    }]
                }
            })


        .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('user', {
                url: '/user/{username}',
                templateUrl: 'templates/user-profile.html',
                controller: 'UserCtrl',
                resolve: {
                    user: ['$stateParams', 'users', function($stateParams, users) {
                        return users.getUserByUsername($stateParams.username);
                    }],
                    favs: ['$q', 'recipes', 'user', function($q, recipes, user) {
                        var promises = [];
                        user.favorites.forEach(function(id) {
                            console.log(id);
                            promises.push(recipes.get(id));
                        })
                        return $q.all(promises);
                    }]
                }

            })
            .state('me', {
                url: '/me',
                templateUrl: 'templates/me.html',
                controller: 'UserCtrl',
                resolve: {
                    user: ['users', function(users) {
                        return users.getCurrentUser();
                    }]
                }

            })
            .state('me.edit', {
                url: '/edit',
                templateUrl: 'templates/me.edit.html',

            });
    }
]);

/*********************
 *     FACTORIES     *
 *********************/

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
    o.delete = function(id) {
        return $http.delete('/recipes/' + id + '/delete', {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).success(function(res) {
            return res
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
    o.favorite = function(id) {
        return $http.put('/recipes/' + id + '/favorite', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            })
            .success(function(res) {
                console.log(res);
                return res.data;
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
}])

app.factory('users', ['$http', 'auth', function($http, auth) {
    var o = {};
    o.getCurrentUser = function() {
        var userId = auth.currentUserId();
        return $http.get('/users/' + userId).then(function(res) {
            return res.data;
        });
    };

    o.getUserByUsername = function(username) {
        return $http.get('/users/' + username).then(function(res) {
            return res.data;
        });
    }

    o.editUser = function(user) {
        return $http.put('/me/edit', user, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).then(function(res) {

            return res.data;
        });
    }

    return o;
}])

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

    auth.currentUserId = function() {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload._id;
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

app.factory('search', ['$http', function($http) {
    var o = {
        results: []
    };
    o.find = function(searchText) {
        // returner hvad der fås tilbage fra route kaldet
        return $http.get('/search/' + searchText)
            .success(function(data) {
                console.log(data);
                angular.copy(data, o.results);
            });
    }
    return o;
}])

//definer funktionen

/*********************
 *    CONTROLLERS    *
 *********************/

app.controller('MainCtrl', [
    '$scope',
    'recipes',
    'auth',
    function($scope, recipes, auth) {
        $scope.recipes = recipes.recipes;
        $scope.isLoggedIn = auth.isLoggedIn;



        // tilføj upvotes (likes)
        $scope.incrementUpvotes = function(recipe) {
            recipes.upvote(recipe);
        };

        // søg opskrifter
        $scope.searchRecipes = function() {
            // Tjek om searchText er tom eller ej
            if ($scope.searchText || !$scope.searchText === '') {
                // der var noget i den, send request til factory
                recipes.find($scope.searchText, function(err, docs) {
                    if (err)
                        return err;
                    // sæt recipes i scope til de returnerede dokumenter (recipes)
                    $scope.recipes = docs;
                });
            } else {
                // hent alle recipes igen hvis searchText er tom
                recipes.getAll(function(err, docs) {
                    if (err)
                        return err;

                    $scope.recipes = docs;
                })
            }

        };
    }
]);

app.controller('ListCtrl', [
    '$scope',
    'recipes',
    function($scope, recipes) {
        $scope.recipes = recipes.recipes;
    }
]);

app.controller('CreateCtrl', [
    '$scope',
    'auth',
    'user',
    'recipes',
    function($scope, auth, user, recipes) {
        $scope.user = user;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.ingredients = [];

        $scope.addRecipe = function() {
            console.log($scope.ingredients)

            recipes.create({
                title: $scope.title,
                ingredients: $scope.ingredients,
                howto: $scope.howto,
                description: $scope.description,
                people: $scope.people,
                preptime: $scope.time
            });

        };

        $scope.addNewIng = function() {
            $scope.ingredients.push({});
        };

        $scope.addNewIng();

        $scope.removeIng = function() {
            if ($scope.ingredients.length <= 1) {
                console.log("You need at least one ingredient!")
            } else {
                var lastItem = $scope.ingredients.length - 1;
                $scope.ingredients.splice(lastItem);
            }
        };
    }
]);

app.controller('RecipesCtrl', [
    '$scope',
    '$timeout',
    'Upload',
    'recipes',
    'recipe',
    'auth',
    'user',
    '$state',
    function($scope, $timeout, Upload, recipes, recipe, auth, user, $state) {
        $scope.recipe = recipe;
        $scope.isLoggedIn = auth.isLoggedIn;
        console.log($scope.isLoggedIn)
        $scope.user = user;
        $scope.bigImage = recipe.images[0];
        //console.log($scope.img1);
        $scope.uploadFiles = function(files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        console.log(files[i]);
                        Upload.upload({
                            url: "/upload",
                            data: {
                                file: files[i],
                                recipeId: recipe._id
                            }
                        }).then(function() {
                            return $timeout(function() { //timeout FTW (fuck state.reload - se: https://mwop.net/blog/2014-05-08-angular-ui-router-reload.html) - only took me 10 hours to fix, k
                                $state.go('.', {}, {
                                    reload: true
                                });
                            }, 0);
                        });
                    }
                }
            }
            //func der undersøger om bruger har fav. recipe, og sætter mdfavorite (se button i UI)
        $scope.checkFav = function() {

            var isInArray = user.favorites.some(function(favId) {
                return favId === recipe._id
            });

            if (isInArray) {
                $scope.mdfavorite = "favorite";
            } else {
                $scope.mdfavorite = "favorite_border";
            }
        }

        //foretag check/instansiate mdfavorite
        $scope.checkFav();

        //affyres når bruger trykker på hjertet
        $scope.favorite = function() {
            recipes.favorite(recipe._id).success(function(res) {
                console.log(res);
            }).then(function() {
                return $timeout(function() { //timeout FTW (fuck state.reload - se: https://mwop.net/blog/2014-05-08-angular-ui-router-reload.html) - only took me 10 hours to fix, k
                    $state.go('.', {}, {
                        reload: true
                    });
                }, 0);
            });
        };


        $scope.deleteRecipe = function(id) {
            recipes.delete(recipe._id).success(function(res) {
                console.log(res);
                $state.go('home');
            })

        };

        $scope.addComment = function() {
            if (!$scope.body) {
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

        $scope.imageClick = function (image) {
            console.log(image);
            $scope.bigImage = image;
            console.log(bigImage);
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

app.controller('UserCtrl', [
    '$scope',
    '$state',
    'user',
    'recipes',
    'auth',
    'users',
    '$window',
    'favs',
    function($scope, $state, user, recipes, auth, users, $window, favs) {
        $scope.user = user;
        $scope.isLoggedIn = auth.isLoggedIn();
        $scope.favs = favs;
        console.log(favs)
        $scope.confirmDelete = function(title, id) {
            if ($window.confirm("Vil du slette " + title)) {
                recipes.delete(id);
                $state.reload();
            }
        }

        $scope.submit = function() {
            users.editUser($scope.user);
            $state.go('me');
        }
    }
])

app.controller('NavCtrl', [
    '$scope',
    'auth',
    'search',
    function($scope, auth, search) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
        $scope.results = search.results;

        $scope.search = function() {
            // Tjek om searchText er tom eller ej
            if ($scope.searchText || !$scope.searchText === '') {
                // der var noget i den, send request til factory
                search.find($scope.searchText, function(err, docs) {
                    if (err)
                        return err;
                    // sæt recipes i scope til de returnerede dokumenter (recipes)
                    $scope.result = docs;
                });
            } else {
                $scope.result = "none found";
            }
        };
    }

])

/*********************
 *     DIRECTIVES    *
 ********************

app.directive('home', function() {
    return {
        templateUrl: 'templates/home.html'
    }
})

app.directive('userProfile', function() {
    return {
        templateUrl: 'templates/user-profile.html'
    }
})

app.directive('me', function() {
    return {
        templateUrl: 'templates/me.html'
    }
})

app.directive('me.edit', function() {
    return {
        templateUrl: 'templates/me.edit.html'
    }
})

app.directive('register', function() {
    return {
        templateUrl: 'templates/register.html'
    }
})

app.directive('recipes', function() {
    return {
        templateUrl: 'templates/recipes.html'
    }
})

app.directive('login', function() {
    return {
        templateUrl: 'templates/login.html'
    }
}); */
