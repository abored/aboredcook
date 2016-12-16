angular.module('cookbook', [

  //FACTORIES
  'authFactory', 'usersFactory', 'recipesFactory', 'searchFactory',

  //CONTROLLERS
  'homeController', 'navController', 'authController', 'recipeController', 'createController',
  'listController', 'editController',  'userController', 'meController',

  //DIVERSE DEPENDINCES
  'ngMaterial', 'ngFileUpload']);

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
