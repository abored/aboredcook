angular.module('editController', ['ngFileUpload', 'ngImgCrop'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('edit', {
                    url: '/recipes/{id}/edit',
                    templateUrl: 'angular/editRecipe/edit.html',
                    controller: 'EditCtrl',
                    resolve: {
                        user: ['Users', function(Users) {
                            return Users.getCurrentUser();
                        }],
                        recipe: ['$stateParams', 'Recipes', function($stateParams, Recipes) {
                            return Recipes.get($stateParams.id);
                        }]
                    }
                })
        }
    ])
    .controller('EditCtrl', [
        '$scope',
        'Auth',
        'recipe',
        'user',
        'Recipes',
        'Upload',
        '$state',
        function($scope, Auth, recipe, user, Recipes, Upload, $state) {
            $scope.user = user;
            $scope.recipe = recipe;
            $scope.isLoggedIn = Auth.isLoggedIn;

            $scope.options = [{ number: 1}, { number: 2}, { number: 3}, { number: 4}, { number: 5}, { number: 6}, { number: 7}, { number: 8}];
            $scope.selectedOption = $scope.options[recipe.people-1];

            $scope.title = recipe.title;
            $scope.howto = recipe.howto;
            $scope.description = recipe.description;
            $scope.time = recipe.preptime;
            $scope.ingredients = recipe.ingredients;

            $scope.editRecipe = function() {

              var editRecipe = {
                  title: $scope.title,
                  ingredients: $scope.ingredients,
                  howto: $scope.howto,
                  description: $scope.description,
                  people: $scope.people,
                  preptime: $scope.time
              };

              console.log(editRecipe);

                Recipes.edit(recipe._id, editRecipe).success(function(res) {

                    //upload valgte billeder og knyt til nyoprettet id.
                    $scope.uploadFiles($scope.files, res._id);

                    //gå til den nye opskrift
                    $state.go('recipes', {
                        id: recipe._id
                    });
                })

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

            $scope.uploadFiles = function(files, id) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        console.log(files[i]);
                        Upload.upload({
                            url: "/upload",
                            data: {
                                file: files[i],
                                recipeId: id
                            }
                        })
                    }
                }
            }
        }
    ])
    .directive('elastic', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function($scope, element) {
                    $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                    var resize = function() {
                        element[0].style.height = $scope.initialHeight;
                        element[0].style.height = "" + element[0].scrollHeight + "px";
                    };
                    element.on("input change", resize);
                    $timeout(resize, 0);
                }
            };
        }
    ]);
