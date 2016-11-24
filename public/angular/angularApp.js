var app = angular.module('cookbook', [

  //FACTORIES
  'authFactory',
  'usersFactory',
  'recipesFactory',
  'searchFactory',

  //CONTROLLERS
  'homeController',
  'navController',
  'authController',
  'recipeController',
  'createController',
  'listController',

  'userController',
  'meController',

  //OTHER DEPENDENCIES
  'ui.router',
  'ngMaterial',
  'ngFileUpload']);

//CONFIG AF ROUTES
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'angular/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('recipes', {
                url: '/recipes/{id}',
                templateUrl: 'angular/recipe/recipe.html',
                controller: 'RecipeCtrl',
                resolve: {
                    recipe: ['$stateParams', 'Recipes', function($stateParams, Recipes) {
                        return Recipes.get($stateParams.id);
                    }],
                    user: ['Users', function(Users) {
                        return Users.getCurrentUser();
                    }]
                }
            })
            .state('list', {
                url: '/list',
                templateUrl: 'angular/list/recipelist.html',
                controller: 'ListCtrl',
                resolve: {
                    recipesPromise: ['Recipes', function(Recipes) {
                        return Recipes.getAll();
                    }]
                }
            })
            .state('create', {
                url: '/create',
                templateUrl: 'angular/create/create.html',
                controller: 'CreateCtrl',
                resolve: {
                    user: ['Users', function(Users) {
                        return Users.getCurrentUser();
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
                templateUrl: 'angular/auth/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (Auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: 'angular/auth/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (Auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
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

            });
    }
]);

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
