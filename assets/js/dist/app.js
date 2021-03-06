angular.module( 'controllers', [] );
angular.module( 'services', [] );
angular.module( 'app', [
	'ngRoute', 
	'services', 
	'controllers'
] ); 
angular.module( 'services' )
	.factory( 'menu', ["$rootScope", function( $rootScope ) {

		var none = 0; 
		var contacts = 1; 
		var settings = 2;

		var active = none;

		var change = "menu-changed"; 

		var changeMenu = function( currentActive ) {

			active = currentActive;
			$rootScope.$broadcast( change ); 
		}

		var getActiveMenu = function() {

			return active; 
		}

		return {

			none: none, 
			contacts: contacts, 
			settings: settings,
			change: change,
			changeMenu: changeMenu, 
			getActiveMenu: getActiveMenu
		}
	}]
); 
angular.module( 'services' )
	.factory( 'user', function() {

		var types = {
			adult: 0, 
			child: 1
		}

		var user = {
			type: types.child
		};  

		var setUserType = function( type ) {

			user.type = type; 
		}

		var getUserType = function() {

			return user.type; 
		}

		return {
			setUser: setUserType, 
			getUser: getUserType, 
			types: types
		}
} );
angular.module( 'controllers' )
	.controller( 'AlarmCtrl', ["$interval", "$timeout", "$log", function( $interval, $timeout, $log ) {

		var vm = this;

		vm.activeIcon = 1; 

		var intervalTime = 250;

		$interval( function() {

			vm.activeIcon === 2 ? vm.activeIcon = 1 : vm.activeIcon++;

		}, intervalTime ); 
}] ); 
angular.module( 'controllers' )
	.controller( 'ChildAlarmCtrl', ["$interval", "$timeout", "$log", function( $interval, $timeout, $log ) {

		var vm = this; 

		vm.alert = {
			active: false, 
			description: ''
		}

		vm.soundAlarm = function() {

			setAlert( 'The police and your parents have been notified and are on their way.' ); 
		}

		function setAlert( description ) {

			vm.alert.active = true; 
			vm.alert.description = description; 
		}

		function deactivateAlarm() {

			vm.alert.active = false; 
			vm.alert.description = ''; 
		}
}] ); 
angular.module( 'controllers' )
	.controller('ContactsCtrl', ["$scope", "menu", function( $scope, menu ) {

	var vm = this;

	vm.visible = false; 

	$scope.$on( menu.change, function() {

		vm.visible = menu.getActiveMenu() === menu.contacts; 
	} ); 

	vm.contacts = [
		{
			name: 'Kristine Sundt Lorentzen', 
			phone: '93216768'
		}, 
		{
			name: 'Alexander Tømmerås', 
			phone: '40609160'
		}, 
		{
			name: 'Alexander Tømmerås', 
			phone: '40609160'
		}, 
		{
			name: 'Alexander Tømmerås', 
			phone: '40609160'
		}, 
		{
			name: 'Alexander Tømmerås', 
			phone: '40609160'
		}, 
		{
			name: 'Alexander Tømmerås', 
			phone: '40609160'
		}
	];
}]);
angular.module( 'controllers' )
	.controller('HeaderCtrl', ["$log", "$scope", "menu", "$rootScope", function( $log, $scope, menu, $rootScope ) {

	var vm = this;

	vm.contacts = {
		active: false
	}

	vm.settings = {
		active: false
	}

	vm.toggleContacts = function() {

		var active = menu.getActiveMenu() === menu.contacts ? menu.none : menu.contacts; 

		menu.changeMenu( active ); 

		vm.contacts.active = menu.getActiveMenu() === menu.contacts; 
		vm.settings.active = false;
	}

	vm.toggleSettings = function() {

		var active = menu.getActiveMenu() === menu.settings ? menu.none : menu.settings; 

		menu.changeMenu( active ); 

		vm.settings.active = menu.getActiveMenu() === menu.settings; 
		vm.contacts.active = false;
	}

	$scope.$on( menu.change, function( event, args ) {

		vm.contacts.active = menu.getActiveMenu() === menu.contacts; 
		$rootScope.showSettings = menu.getActiveMenu() === menu.settings;
	})
}]); 
angular.module( 'app' )
	.config( ["$routeProvider", function( $routeProvider ) { // WHY DOESN'T THIS WORK?! 

		$routeProvider

			.when( '/', 		{ templateUrl: 'views/main.html' } )
			.when( '/alarm', 	{ templateUrl: 'views/alarm.html'} );

		// $routeProvider

		// 	.when( '/', 		{ templateUrl: 'views/main.html' } )
		// 	.when( '/alarm', 	{ templateUrl: 'views/alarm.html'} )
		// 	.when( '/child', 	{ templateUrl: 'views/child.html' } );  
	}] ).run( ["$rootScope", "user", function( $rootScope, user ) {
		$rootScope.isChild = user.getUser() === user.types.child;
		$rootScope.setChildMode = function() {
			$rootScope.isChild = true;
			user.setUser( user.types.child );
			return false;
		}
		$rootScope.setAdultMode = function() {
			$rootScope.isChild = false;
			user.setUser( user.types.adult );
			return false;
		}
	}] );