function addTrucksCtrl($scope, $http, $location, $anchorScroll, $timeout, ngTableParams, UserRequest) {
    console.log('Inside addTrucksCtrl');
    var data = [];

    $scope.isError = true;
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
                    "model" : "",
                    "regno" : "",
                    "load" : "",
                    haveMessage : false
                }
            }
        );
        $scope.isError = true;
        $scope.tableParams.reload();
    };

    $scope.checkErrors = function(truck){

        if(typeof truck != "undefined" && truck != null && typeof truck.details != "undefined" && truck.details != null){
            if(typeof truck.details.type != "undefined" && truck.details.type != null && truck.details.type != ""
                && typeof truck.details.make != "undefined" && truck.details.make != null && truck.details.make != ""
                && typeof truck.details.model != "undefined" && truck.details.model != null && truck.details.model != ""
                && typeof truck.details.regno != "undefined" && truck.details.regno != null && truck.details.regno != ""
                && typeof truck.details.load != "undefined" && truck.details.load != null && truck.details.load != ""){
                $scope.isError = false;
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    };

    $scope.removeTruck = function(index){
        data.splice(index, 1);
        $scope.tableParams.reload();
    };

    $scope.showMessages = function(list){
        console.log("Show Messages check: "+JSON.stringify(list));
        for(var ind in list){
            var item = list[ind];
            console.log("Show Messages check item: "+JSON.stringify(item));
            if(typeof list[ind]["details.haveMessage"] == "undefined" || list[ind]["details.haveMessage"] == null){
                return false;
            }
        }
        return true;
    };

    $scope.addTrucks = function(trucks){
        console.log("Adding trucks");
        if(typeof trucks != "undefined" && trucks != null && Array.isArray(trucks) && trucks.length > 0){
            console.log(JSON.stringify(trucks));
            for(var i in trucks){
                var truck = trucks[i];
                console.log(JSON.stringify(truck));
                if(typeof truck != "undefined" && truck != null && typeof truck.details != "undefined" && truck.details != null){
                    if(typeof truck.details.type != "undefined" && truck.details.type != null && truck.details.type != ""
                        && typeof truck.details.make != "undefined" && truck.details.make != null && truck.details.make != ""
                        && typeof truck.details.model != "undefined" && truck.details.model != null && truck.details.model != ""
                        && typeof truck.details.regno != "undefined" && truck.details.regno != null && truck.details.regno != ""
                        && typeof truck.details.load != "undefined" && truck.details.load != null && truck.details.load != ""){
                        console.log("Saving truck: "+JSON.stringify(truck));
                        $http.post("/TransEarth/addTruck", {truck : truck})
                            .success(function(result) {
                                console.log("Truck saved successfully");
                                truck.haveMessage = true;
                                truck.message = "Saved";
                                data[i] = truck;
                                if($scope.showMessages(data)){
                                    console.log("Trucks with message "+i+" :"+JSON.stringify(data));
                                    $scope.tableParams.reload();
                                }
                            }).error(function(err) {
                                console.log("Truck saved failed:"+err);
                                truck.haveMessage = true;
                                truck.message = "Save Crashed";
                                data[i] = truck;
                                if($scope.showMessages(data)){
                                    console.log("Trucks with Save Crashed "+i+" :"+JSON.stringify(data));
                                    $scope.tableParams.reload();
                                }
                            });
                    }else{
                        truck.haveMessage = true;
                        truck.message = "Something Crashed";
                        data[i] = truck;
                        if($scope.showMessages(data)){
                            console.log("Trucks with Something Crashed "+i+" :"+JSON.stringify(data));
                            $scope.tableParams.reload();
                        }
                    }
                }else{
                    truck.haveMessage = true;
                    truck.message = "Don't Crash";
                    data[i] = truck;
                    if(trucks.length == i){
                        console.log("Trucks with Don't Crash "+i+" :"+JSON.stringify(data));
                        $scope.tableParams.reload();
                    }
                }
            }
        }
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

}
