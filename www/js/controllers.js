angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, pouchDB) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.sync = function() {
    var dbLocal = pouchDB('tescik');
    var dbRemote = pouchDB('http://localhost:5984/apa');
    dbLocal.info().then(function (info) {
      console.log("LOCAL ::::::::::::::::::::::::::::::::");
      console.log(info);
    });
    dbRemote.info().then(function (info) {
      console.log("REMOTE ::::::::::::::::::::::::::::::::");
      console.log(info);
    });
    dbRemote.replicate.to(dbLocal).on('complete', function () {
      console.log("SYNCED");
    }).on('error', function (err) {
      console.log(":(");
      console.log(err);
    });
  }
})

.controller('PlaylistsCtrl', function($scope, pouchDB) {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  var db = pouchDB('tescik');
  db.allDocs({
    include_docs: true, 
    attachments: false
  }).then(function (result) {
    console.log(result);
    $scope.playlists = result.rows.map(function(el){return el.doc;});
  }).catch(function (err) {
    console.log(err);
  });
})

.controller('PlaylistCtrl', function($scope, $stateParams, pouchDB) {
  console.log($stateParams.playlistId);
  var db = pouchDB('tescik');
  db.get($stateParams.playlistId, {
    include_docs: true, 
    attachments: false
  }).then(function (result) {
    $scope.myObj = result;
    var attachmentKey;
    for(i in result["_attachments"]) {
      attachmentKey = i;
    }
    return db.getAttachment(result._id, attachmentKey);
  }).then(function (blob) {
    $scope.myResSrc = URL.createObjectURL(blob);
  }).catch(function (err) {
    console.log(err);
  });
});