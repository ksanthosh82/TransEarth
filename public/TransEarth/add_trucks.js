function addTrucksCtrl($scope, $http, $location, $anchorScroll, $timeout, ngTableParams, UserRequest) {
    console.log('Inside addTrucksCtrl');
    var data = [];

    $scope.init = function(){
        $scope.getTruckTypes();
        $scope.getTruckMakes();
    };
    $scope.truckTypeList = [];
    $scope.getTruckTypes = function(){
        $http.get("/TransEarth/getTruckTypes")
            .success(function(data) {
                console.log("Truck Types looked up:"+JSON.stringify(data));
                $scope.truckTypeList = data;
                //$scope.truck.details.type = "";
            }).error(function(err) {
                console.log("truckType Lookup failed:"+JSON.stringify(err));
            });
    };
    //$scope.getTruckTypes();
    $scope.makeList = [];
    $scope.getTruckMakes = function(){
        $http.get("/TransEarth/getTruckMakes")
            .success(function(data) {
                console.log("Truck Makes looked up:"+data);
                $scope.makeList = data;
                //$scope.truck.details.make = "";
            }).error(function(err) {
                console.log("Make Lookup failed:"+JSON.stringify(err));
            });
    };

    $scope.addTruckRow = function(){
        var index = data.length + 1;
        data.push(
            {
                "details" : {
                    "type" : "",
                    "make" : "",
                    "model" : "model" + index,
                    "regno" : "regno" + index,
                    "load" : "load" + index
                }
            }
        );
        $scope.tableParams.reload();
    };

    $scope.tableParams = new ngTableParams({
        page: 1,   // show first page
        total: 1,  // value less than count hide pagination
        count: 5  // count per page
    }, {
        counts: [], // hide page counts control
        //total: data.length, // length of data
        getData: function ($defer, params) {
            var pageData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
            $defer.resolve(pageData);
        }
    });
    /*$timeout(function() {
        // update table params
        data = [
            {
                "details" : {
                    "type" : "type1",
                    "make" : "make1",
                    "model" : "model1",
                    "regno" : "regno1",
                    "load" : 1
                }
            },
            {
                "details" : {
                    "type" : "type2",
                    "make" : "make2",
                    "model" : "model2",
                    "regno" : "regno2",
                    "load" : 2
                }
            }
        ];
        // set new data
        //$defer.resolve(data.result);
        $scope.tableParams.reload();
    }, 500);*/
}
