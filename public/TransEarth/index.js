function indexCtrl($scope, $http, $location, $route, UserRequest) {
    //console.log('Inside indexCtrl');

    //$scope.user = window.user_name;
    clearAlert("indexTruckPostListMessage");
    clearAlert("indexLoadPostListMessage");

    if(typeof $scope.user == "undefined"){
        $scope.page.template = "/TransEarth/site_home";
    }

    $scope.index = {};
    $scope.index.filterOptions = {
        filterText: '',
        useExternalFilter : false
    };
    $scope.index.truckPostListColumnDefs = [];
    $scope.index.truckPostListGridOptions = {
        data: 'index.truckPostList',
        //filterOptions: $scope.filterOptions,
        //showColumnMenu : true,
        //showFilter : false,
        //resizable : true,
        //enableColumnResize: true,
        //showGroupPanel: true,
        headerRowHeight : 28,
        rowHeight : 25,
        enableCellSelection : true,
        columnDefs: 'index.truckPostListColumnDefs'
    };
    $scope.index.truckPostList = [
    ];

    $scope.index.truckPostListMessageAvailable = false;
    $scope.index.truckPostListShow = false;
    $http.post("/TransEarth/getTruckPostingsSummary", {filters : []})
        .success(function(data) {
            // succesAlert(data.statusMsg, 'eaiSaveStatus');

            if(typeof data != 'undefined' && data != null
                    && data.truckPostList != 'undefined' && data.truckPostList != null){
                //console.log(JSON.stringify(data));
                $scope.index.truckPostList = data.truckPostList.details;
                $scope.index.truckPostListColumnDefs = data.truckPostList.headers;
                $scope.index.truckPostListOptions = {
                    enableCellSelection: false,
                    enableRowSelection: false
                };

                $scope.index.truckPostListGridOptions = {
                    data: 'index.truckPostList',
                    /*beforeSelectionChange: function() {
                        return $scope.index.truckPostListOption;
                    },*/
                    columnDefs: 'index.truckPostListColumnDefs'
                };

                $scope.index.truckPostListShow = true;
                $scope.index.searchButtonName = "Review Truck Posts";
            }else{
                $scope.index.truckPostListMessageAvailable = true;
                $scope.index.truckPostListMessage = "No data available";
                succesWarning($scope.index.truckPostListMessage, 'indexTruckPostListMessage');
                //console.log("No data available");
            }
        }).error(function(data) {
            $scope.index.truckPostListMessageAvailable = true;
            succesError(data.statusMsg, 'indexTruckPostListMessage');
        });

    $scope.index.loadPostList = [
    ];

    $scope.index.loadPostListColumnDefs = [];
    $scope.index.loadPostListGridOptions = {
        data: 'index.loadPostList',
        //filterOptions: $scope.filterOptions,
        //showColumnMenu : true,
        //showFilter : false,
        //showGroupPanel: true,
        //enableColumnResize: true,
        headerRowHeight : 28,
        rowHeight : 25,
        enableCellSelection : true,
        headerClass : "",
        columnDefs: 'index.loadPostListColumnDefs'
    };
    $scope.index.loadPostListShow = false;
    $http.post("/TransEarth/getLoadPostingsSummary", {filters : []})
        .success(function(data) {
            // succesAlert(data.statusMsg, 'eaiSaveStatus');

            if(typeof data != 'undefined' && data != null
                && data.loadPostList != 'undefined' && data.loadPostList != null){
               // console.log(JSON.stringify(data));
                $scope.index.loadPostList = data.loadPostList.details;
                $scope.index.loadPostListColumnDefs = data.loadPostList.headers;
                $scope.index.loadPostListOptions = {
                    enableCellSelection: false,
                    enableRowSelection: false
                };

                $scope.index.loadPostListGridOptions = {
                    data: 'index.loadPostList',
                    /*beforeSelectionChange: function() {
                     return $scope.index.loadPostListOption;
                     },*/
                    headerRowHeight : 32,
                    rowHeight : 25,
                    columnDefs: 'index.loadPostListColumnDefs'
                };

                $scope.index.loadPostListShow = true;
                $scope.index.searchButtonName = "Review Load Posts";
            }else{
                $scope.index.loadPostListMessageAvailable = true;
                $scope.index.loadPostListShow = false;
                $scope.index.loadPostListMessage = "No data available";
                succesWarning($scope.index.loadPostListMessage, 'indexLoadPostListMessage');
                //console.log("No data available");
            }
        }).error(function(data) {
            $scope.index.loadPostListMessageAvailable = true;
            $scope.index.loadPostListShow = false;
            succesError(data.statusMsg, 'indexLoadPostListMessage');
        });
    //$location.url('/TransEarth/forms');
}
