//ng-grid Truck List
function truckListCtrl($scope, $http, $location, UserRequest) {
    console.log('Inside truckListCtrl');

    $scope.truckPostList = {};
    $scope.truckPostList.filter = {};
    $scope.truckPostList.filter.from = {
        place : "",
        state : "",
        isSelected : false,
        disable : false
    };

    $scope.truckPostList.filter.to = {
        place : "",
        state : "",
        isSelected : false,
        disable : false
    };

    $scope.truckPostList.filter.dateRange = 2;
    $scope.truckPostList.filter.dt = new Date();
    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.opened = false;
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        //console.log("Opened");
        $scope.opened = true;
    };

    $scope.truckPostList.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.truckPostList.searchButtonName = "Search";
    $scope.resetSearchCategory = function(){
        $scope.truckPostList.searchButtonName = "Search";
    };
    $scope.truckPostList.filterOptions = {
        filterText: '',
        useExternalFilter : false
    };
    $scope.truckPostList.totalServerItems = 0;
    $scope.truckPostList.pagingOptions = {
        pageSizes: [10, 20, 30],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        //console.log(JSON.stringify(pagedData));
        $scope.truckPostList.list = pagedData;

        $scope.truckPostList.totalServerItems = data.length;
        console.log("truckPostList.totalServerItems: "+$scope.truckPostList.totalServerItems);
        $scope.truckPostList.gridOptions = {
            data: 'truckPostList.list',
            /*beforeSelectionChange: function() {
             return $scope.truckList.truckListOption;
             },*/
            columnDefs: 'truckPostList.columnDefs'
        };

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        if($scope.truckPostList.searchTriggered){
            setTimeout(function () {
                var data;
                //console.log("Search Text: "+searchText);
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.post("/TransEarth/getTruckPostings", {filters : [
                        $scope.truckPostList.filter.from,
                        $scope.truckPostList.filter.to,
                        $scope.truckPostList.filter.dateRange,
                        $scope.truckPostList.filter.dt
                    ]}).success(function(data) {
                        // succesAlert(data.statusMsg, 'eaiSaveStatus');
                        if(typeof data != 'undefined' && data != null
                            && typeof data.truckPostList != 'undefined' && data.truckPostList != null
                            && typeof data.truckPostList.details != "undefined" && data.truckPostList.details != null
                            && data.truckPostList.details.length > 0){
                            //console.log(JSON.stringify(data.truckPostList.details));
                            var filteredData = data.truckPostList.details.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            //console.log("Filtered Data:"+JSON.stringify(filteredData));
                            $scope.truckPostList.columnDefs = data.truckPostList.headers;
                            $scope.setPagingData(filteredData,page,pageSize);
                            $scope.truckPostList.listShow = true;
                            $scope.truckPostList.searchButtonName = "Review TruckList";
                        }else{
                            //console.log("No data available");
                            $scope.truckPostList.messageAvailable = true;
                            $scope.truckPostList.listShow = false;
                            $scope.truckPostList.message = "No data available";
                            succesWarning($scope.truckPostList.message, 'trucklist_alert');

                        }
                    }).error(function(err) {
                        $scope.truckPostList.listShow = false;
                        $scope.truckPostList.messageAvailable = true;
                        succesError(err.statusMsg, 'trucklist_alert');
                    });
                    /*$http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });*/
                } else {
                    $http.post("/TransEarth/getTruckPostings", {filters : [
                        $scope.truckPostList.filter.from,
                        $scope.truckPostList.filter.to,
                        $scope.truckPostList.filter.dateRange,
                        $scope.truckPostList.filter.dt
                    ]}).success(function(data) {
                        // succesAlert(data.statusMsg, 'eaiSaveStatus');
                        if(typeof data != 'undefined' && data != null
                            && typeof data.truckPostList != 'undefined' && data.truckPostList != null
                            && typeof data.truckPostList.details != "undefined" && data.truckPostList.details != null
                            && data.truckPostList.details.length > 0){
                            //console.log(JSON.stringify(data.truckPostList.details));
                            var filteredData = data.truckPostList.details;
                            $scope.truckPostList.columnDefs = data.truckPostList.headers;
                            $scope.setPagingData(filteredData,page,pageSize);
                            $scope.truckPostList.listShow = true;
                            $scope.truckPostList.searchButtonName = "Review TruckList";
                        }else{
                            //console.log("No data available");
                            $scope.truckPostList.messageAvailable = true;
                            $scope.truckPostList.listShow = false;
                            $scope.truckPostList.message = "No data available";
                            succesWarning($scope.truckPostList.message, 'trucklist_alert');

                        }
                    }).error(function(data) {
                        $scope.truckPostList.listShow = false;
                        $scope.truckPostList.messageAvailable = true;
                        succesError(data.statusMsg, 'trucklist_alert');
                    });
                    /*$http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });*/
                }
            }, 100);
        }
    };
    //$scope.getPagedDataAsync($scope.truckPostList.pagingOptions.pageSize, $scope.truckPostList.pagingOptions.currentPage);

    $scope.$watch('truckPostList.pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.truckPostList.pagingOptions.pageSize, $scope.truckPostList.pagingOptions.currentPage, $scope.truckPostList.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('truckPostList.filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.truckPostList.pagingOptions.pageSize, $scope.truckPostList.pagingOptions.currentPage, $scope.truckPostList.filterOptions.filterText);
        }
    }, true);

    $scope.truckPostList.columnDefs = [];
    $scope.truckPostList.gridOptions = {
        data: 'truckPostList.list',
        //filterOptions: $scope.filterOptions,
        //showColumnMenu : true,
        //showFilter : false,
        //resizable : true,
        //enableColumnResize: true,
        enablePaging: true,
        pagingOptions: $scope.truckPostList.pagingOptions,
        filterOptions: $scope.truckPostList.filterOptions,
        showFooter: true,
        rowHeight : 25,
        showGroupPanel: true,
        columnDefs: 'truckPostList.columnDefs'
    };
    $scope.truckPostList.truckList = [];

    $scope.truckPostList.searchTriggered = false;
    $scope.truckPostList.listShow = false;
    $scope.truckPostList.messageAvailable = false;

    $scope.searchTrucks = function(){
        $scope.truckPostList.searchTriggered = true;
        $scope.getPagedDataAsync($scope.truckPostList.pagingOptions.pageSize, $scope.truckPostList.pagingOptions.currentPage);
    };
}

//ng-table driven
function truckListCtrlInvalid($scope, $http, $location, UserRequest, $filter,  $q, ngTableParams, $sce) {
    console.log('Inside truckListCtrl');

    $scope.truckList = {};
    $scope.truckList.filter = {};

    $scope.truckList.filter.dateRange = null;
    $scope.truckList.filter.dt = new Date();

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.opened = false;
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        console.log("Opened");
        $scope.opened = true;
    };

    $scope.truckList.searchButtonName = "Search";

    $scope.index = {};
    $scope.index.filterOptions = {
        filterText: '',
        useExternalFilter : false
    };

    $scope.data = [{}];

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 20,           // count per page
        filter: {
            // initial filter
        },
        sorting: {
            // initial sorting
        }
    }, {
        total:  $scope.data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            //console.log("params: "+JSON.stringify(params));
            //console.log("data: "+JSON.stringify(data));
            //console.log("$filter: "+JSON.stringify(params.filter()));
            var testData = $scope.data;
            var filteredData = params.filter() ?
                $filter('filter')(testData, params.filter()) :
                data;
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                data;

            console.log("filteredData: "+JSON.stringify(filteredData));
            console.log("orderedData: "+JSON.stringify(orderedData));

            $scope.trucks = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve($scope.trucks);
        },
        $scope: {$data:[]}
    });
    /*$scope.index.truckListColumnDefs = [];
    $scope.index.truckGridOptions = {
        data: 'index.truckList',
        //filterOptions: $scope.filterOptions,
        showColumnMenu : true,
        showFilter : false,
        resizable : true,
        enableColumnResize: true,
        columnDefs: 'index.truckListColumnDefs'
    };
    $scope.index.truckList = [
    ];*/

    $scope.index.truckListShow = false;
    $scope.index.truckListMessageAvailable = false;
    $scope.searchTrucks = function(){

        var filters = {};
        if(typeof $scope.truckList.filter.from != "undefined" && $scope.truckList.filter.from != null){
            filters.source = $scope.truckList.filter.from;
        }
        if(typeof $scope.truckList.filter.to != "undefined" && $scope.truckList.filter.to != null){
            filters.destination = $scope.truckList.filter.to;
        }
        if(typeof $scope.truckList.filter.dt != "undefined" && $scope.truckList.filter.dt != null){
            filters.availableDate = $scope.truckList.filter.dt;
        }
        console.log("Truck List Filters: "+JSON.stringify(filters));
        $http.post("/TransEarth.getTruckPostingsSummary", {filters : filters})
            .success(function(data) {
                if(typeof data != 'undefined' && data != null
                    && typeof data.truckList != 'undefined' && data.truckList != null
                    && typeof data.truckList.details != "undefined" && data.truckList.details != null){
                    console.log(JSON.stringify(data));
                    /*$scope.index.truckList = data.truckList.details;
                    $scope.index.truckListColumnDefs = data.truckList.headers;
                    $scope.index.truckListOptions = {
                        enableCellSelection: false,
                        enableRowSelection: false
                    };

                    $scope.index.truckGridOptions = {
                        data: 'index.truckList',
                        columnDefs: 'index.truckListColumnDefs'
                    };*/
                    //console.log("Fetched Trucks data:"+JSON.stringify(responseData));
                    convertDateStringsToDates(data.truckList.details);
                    //console.log("Fetched Release data:"+JSON.stringify(responseData));
                    $scope.data = data.truckList.details;
                    $scope.tableParams.reload();
                    $scope.index.truckListShow = true;
                    $scope.index.searchButtonName = "Review TruckList";
                }else{
                    $scope.index.messageAvailable = true;
                    $scope.index.truckListMessage = "No data available";
                    succesWarning($scope.index.truckListMessage, 'indexTruckListMessage');
                    //console.log("No data available");
                }
            }).error(function(data) {
                $scope.index.messageAvailable = true;
                succesError(data.statusMsg, 'indexTruckListMessage');
            });
    };
    $scope.text = 'Inside TransEarth Table controller';
    //$location.url('/table');
}
