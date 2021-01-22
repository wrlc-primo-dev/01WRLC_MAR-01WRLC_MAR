(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad', 'wrlcAnnounce']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/
    app.constant('announceConfig', {
        announceAPI: 'https://spreadsheets.google.com/feeds/list/1ycVxLuY5LYwsFbGX-n_TlJPAF-wI73Lf_aJiZKzm0vI/1/public/values?alt=json',
        getShow: function(response) {
            return(response.data.feed.entry[5].gsx$show.$t);
        },
        getMessage: function(response) {
            return(response.data.feed.entry[5].gsx$message.$t);
        },
        getLink: function(response) {
            return(response.data.feed.entry[5].gsx$link.$t);
        }
    });

    /* Hide OpenLibrary link as "Availability > REQUEST" if no ISBN match */
    app.controller('HideOpenLibraryRequestController', ['$scope', '$http', function($scope, $http) {
        $scope.$watch('$ctrl.parentCtrl.service', function(service) {
            if ((service['service-type'] === 'OvL') && (service['link-to-service'].startsWith('https://openlibrary.org/search?isbn='))) {
                var isbn = service['link-to-service'].replace('https://openlibrary.org/search?isbn=', '')
                var url = 'http://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json';
                $http.get(url).then(function successCallback(response) {
                    if (response.data) {
                       var isbnKey = 'ISBN:' + isbn;
                       if (isbnKey in response.data) {
                           var isbnValue = response.data[isbnKey];
                           if ((!(isbnValue['preview'])) || (isbnValue['preview'] !== 'borrow')) {
                               // add class to hide button
                               document.querySelector('button[aria-label="Check full text availability at OpenLibrary"]').classList.add('ng-hide');
                           }
                       }
                       else {
                           // add class to hide button
                           document.querySelector('button[aria-label="Check full text availability at OpenLibrary"]').classList.add('ng-hide');
                       }
                    }
                    }, function errorCallback(response) {
                    console.log(response);
                })
            }
        });
    }]);

    app.component('prmServiceButtonAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'HideOpenLibraryRequestController',
        template: ''
    })

    /* Hide OpenLibrary link as "How to Get It" (no sub-heading) if no ISBN match */
    app.controller('HideOpenLibraryGetItController', ['$scope', '$http', function($scope, $http) {
        $scope.$watch('$ctrl.parentCtrl.almaHowToGetitService._services.serviceinfo', function(service) {
            var i;
            for (i = 0; i < service.length; i++) {
                if (service[i]['link-to-service'].startsWith('https://openlibrary.org/search?isbn=')) {
                    var value = service[i]['link-to-service'];

                    var isbn = value.replace('https://openlibrary.org/search?isbn=', '')
                    var url = 'http://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json';
                    $http.get(url).then(function successCallback(response) {
                        if (response.data) {
                            var isbnKey = 'ISBN:' + isbn;
                            if (isbnKey in response.data) {
                                var isbnValue = response.data[isbnKey];
                                if ((!(isbnValue['preview'])) || (isbnValue['preview'] !== 'borrow')) {
                                    // add class to hide link
                                    document.querySelector('a[translate="Check full text availability at OpenLibrary "]').closest('md-list-item').classList.add('ng-hide');
                                }
                            }
                            else {
                                // add class to hide link
                                document.querySelector('a[translate="Check full text availability at OpenLibrary "]').closest('md-list-item').classList.add('ng-hide');
                            }
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    })
                }
            }
        });
    }]);

    app.component('almaHowovpAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'HideOpenLibraryGetItController',
        template: ''
    })

    /* Hide OpenLibrary link as "View Online > Full text availability" if no ISBN match */
    app.controller('HideOpenLibraryOnlineController', ['$scope', '$http', function($scope, $http) {
        $scope.$watch('$ctrl.parentCtrl.services', function(service) {
            var i;
            for (i = 0; i < service.length; i++) {
                if (service[i]['serviceUrl'].startsWith('https://openlibrary.org/search?isbn=')) {
                    var value = service[i]['serviceUrl'];
                    var isbn = value.replace('https://openlibrary.org/search?isbn=', '')
                    var url = 'http://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json';
                    $http.get(url).then(function successCallback(response) {
                        console.log(response);
                        if (response.data) {
                            var isbnKey = 'ISBN:' + isbn;
                            if (isbnKey in response.data) {
                                var isbnValue = response.data[isbnKey];
                                if ((!(isbnValue['preview'])) || (isbnValue['preview'] !== 'borrow')) {
                                    // add class to hide link
                                    document.querySelector('md-list-item[aria-label="Check full text availability at OpenLibrary   , opens in a new window"]').classList.add('ng-hide');
                                }
                            }
                            else {
                                // add class to hide link
                                document.querySelector('md-list-item[aria-label="Check full text availability at OpenLibrary   , opens in a new window"]').classList.add('ng-hide');
                            }
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    })
                }
            }
        })
    }]);

    app.component('prmAlmaViewitItemsAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'HideOpenLibraryOnlineController',
        template: ''
    })

})();

   
