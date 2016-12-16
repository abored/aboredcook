angular.module('createController', ['ngFileUpload', 'ngImgCrop'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('create', {
                    url: '/create',
                    templateUrl: 'angular/create/create.html',
                    controller: 'CreateCtrl'
                })
        }
    ])
    .controller('CreateCtrl', [
        '$scope',
        'Auth',
        'Recipes',
        'Upload',
        '$state',
        function($scope, Auth, Recipes, Upload, $state) {
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
                    $scope.error = "Du skal have mindst én ingrediens!";
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
    function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function () {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);
