// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.new', {
      url: '/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/new.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});


angular.module('starter.services', [])

  .factory('Sounds', function($q) {

    var deleteSound = function(x) {
      console.log("calling deleteSound");
      var deferred = $q.defer();
      getSounds().then(function(sounds) {
        sounds.splice(x,1);
        localStorage.mysoundboard = JSON.stringify(sounds);
        deferred.resolve();
      });

      return deferred.promise;

    }

    var getSounds = function() {
      var deferred = $q.defer();
      var sounds = [];

      if(localStorage.mysoundboard) {
        sounds = JSON.parse(localStorage.mysoundboard);
      }
      deferred.resolve(sounds);

      return deferred.promise;
    }

    var playSound = function(x) {
      getSounds().then(function(sounds) {
        var sound = sounds[x];

        /*
         Ok, so on Android, we just work.
         On iOS, we need to rewrite to ../Library/NoCloud/FILE'
         */
        var mediaUrl = sound.file;
        if(device.platform.indexOf("iOS") >= 0) {
          mediaUrl = "../Library/NoCloud/" + mediaUrl.split("/").pop();
        }
        var media = new Media(mediaUrl, function(e) {
          media.release();
        }, function(err) {
          console.log("media err", err);
        });
        media.play();
      });
    }

    var saveSound = function(s) {
      console.log("calling saveSound");
      var deferred = $q.defer();
      getSounds().then(function(sounds) {
        sounds.push(s);
        localStorage.mysoundboard = JSON.stringify(sounds);
        deferred.resolve();
      });

      return deferred.promise;
    }

    return {
      get:getSounds,
      save:saveSound,
      delete:deleteSound,
      play:playSound
    };
  });
