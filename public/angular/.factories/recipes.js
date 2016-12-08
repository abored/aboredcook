angular.module('recipesFactory', [])
    .factory('Recipes', ['$http', 'Auth', function($http, Auth) {
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
                return res.data
            });
        };
        o.delete = function(id) {
            return $http.delete('/recipes/' + id + '/delete', {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            }).success(function(res) {
                return res
            });

        };
        o.edit = function(id, recipe) {
            return $http.put('/recipes/' + id + '/edit', recipe, {
            }).success(function(res) {
                return res
            });

        };
        o.create = function(recipe) {
            return $http.post('/recipes', recipe, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            }).success(function(res) {
                //o.recipes.push(data);
                return res;
            });
        };
        o.addComment = function(id, comment) {
            return $http.post('/recipes/' + id + '/comments', comment, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            });
        };
        o.favorite = function(id) {
            return $http.put('/recipes/' + id + '/favorite', null, {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
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
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .success(function() {
                    recipe.upvotes += 1;
                });
        };
        o.upvoteComment = function(recipe, comment) {
            return $http.put('/recipes/' + recipe._id + '/comments/' + comment._id + '/upvote', null, {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .success(function() {
                    comment.upvotes += 1;
                });
        };

        return o;
    }])
