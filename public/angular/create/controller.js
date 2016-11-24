angular.module('createController', [])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
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
        }
    ])
    .controller('CreateCtrl', [
        '$scope',
        'Auth',
        'user',
        'Recipes',
        'Upload',
        '$state',
        function($scope, Auth, user, Recipes, Upload, $state) {
            $scope.user = user;
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.ingredients = [];

            $scope.addRecipe = function() {
                console.log($scope.ingredients)

                Recipes.create({
                    title: $scope.title,
                    ingredients: $scope.ingredients,
                    howto: $scope.howto,
                    description: $scope.description,
                    people: $scope.people,
                    preptime: $scope.time
                }).success(function(res) {

                    //upload valgte billeder og knyt til nyoprettet id.
                    $scope.uploadFiles($scope.files, res._id);

                    //gå til den nye opskrift
                    $state.go('recipes', {
                        id: res._id
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
    ]);
