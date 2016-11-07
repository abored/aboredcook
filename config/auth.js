// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
    'clientID': "111401585940836",
    'clientSecret': "b444833d048718a1fcf17236161500e8",
    'callbackURL': "http://localhost:3000/auth/facebook/callback",
	'profileFields': ['id', 'displayName', 'link', 'emails']
    },

    'googleAuth' : {
        'clientID'      : "1071692605071-0sk7hdmee3jc984omg7gg13ja2f8v9vc.apps.googleusercontent.com",
        'clientSecret'  : "6dGWSXQ40SW48hIa35JKM1C3",
        'callbackURL'   : "http://localhost:3000/auth/google/callback"
    }

};
