angular.module("testTaskApp", ["ngResource", "ngRoute"])
    .constant("baseUrl", "http://localhost:8000/api/verses/")
    .config(function ($locationProvider, $routeProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when("/table", {
            templateUrl: "client-views/table.html"
        });

        $routeProvider.when("/edit", {
            templateUrl: "client-views/edit.html"
        });

        $routeProvider.when("/create", {
            templateUrl: "client-views/edit.html"
        });

        $routeProvider.otherwise({
            templateUrl: "client-views/table.html"
        });
    })
    .controller("versesCtrl", function ($scope, $http, $resource, $location, baseUrl) {

        $scope.versesResource = $resource(baseUrl + ":id", { id: "@_id" }, {update: { method: 'PUT'}});
        $scope.isHome = true;
        if($location.path() !== '/'){
            window.location = '/'
        }
        $scope.isCreateVerse = false;

        // получение всех данных из модели
        $scope.refresh = function() {
            $scope.verses = $scope.versesResource.query();
        }

        // создание нового элемента
        $scope.create = function (verse) {
            new $scope.versesResource(verse).$save().then(function (newVerse) {
                $scope.verses.push(newVerse);
                $location.path("/");
                $scope.isHome = true;
            });
        }

        // обновление элемента
        $scope.update = function (verse) {
            verse.$update();
            $location.path("/");
            $scope.isHome = true;
            console.log($scope.isHome);
        }

        // удаление элемента из модели
        $scope.delete = function (verse) {
            var confirm = window.confirm('Are you sure you want delete this?');
            if(confirm){
                verse.$remove().then(function () {
                    $scope.verses.splice($scope.verses.indexOf(verse), 1);
                });
                $location.path("/");
                $scope.isHome = true;
            }
        }

        // редеактирование существующего или создание нового элемента
        $scope.editOrCreate = function (verse) {
            if(!verse){
                $location.path("/create");
                $scope.isCreateVerse = true;
                $scope.currentVerse = {} ;
            }else{
                $scope.currentVerse = verse ;
                $location.path("/edit");
                $scope.isCreateVerse = false;
            }
            $scope.isHome = false;
        }

        // сохранение изменений
        $scope.saveEdit = function (verse) {
            if (angular.isDefined(verse._id)) {
                $scope.update(verse);
            } else {
                $scope.create(verse);
            }
        }

        // отмена изменений и возврат в представление table
        $scope.cancelEdit = function () {
            if ($scope.currentVerse && $scope.currentVerse.$get) {
                $scope.currentVerse.$get();
            }
            $scope.currentVerse = {};
            $location.path("/");
            $scope.isHome = true;
        }

        $scope.goHome = function () {
            $location.path("/");
            $scope.isHome = true;
        }

        $scope.refresh();
    });