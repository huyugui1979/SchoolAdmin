'use strict';

angular.module('myApp.truancy', ['ngRoute','NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/truancy', {
    templateUrl: 'truancy/truancy.html',
    controller: 'truancyCtrl'
  });
}])

.controller('truancyCtrl', function($scope,$http) {
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            totalPage: 1
        };

        $scope.gridOptions = {
            paginationPageSizes: [20, 50, 75],
            paginationPageSize: 25,
            enableCellEditOnFocus: true,
            showColumnFooter: true,
            useExternalPagination: true,
            columnDefs: [
                {
                    name: '姓名',
                    field: 'StudentName'
                    //footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                },
                {
                    name: '旷课次数',
                    field: 'Number'
                    //footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                }


            ],
            onRegisterApi: function (gridApi) {

                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    rowEntity[colDef.field] = newValue;
                    //updateDoctor(rowEntity);
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (paginationOptions.pageSize != pageSize) {
                        paginationOptions.pageNumber = 1;
                        paginationOptions.pageSize = pageSize;
                    } else {
                        paginationOptions.pageNumber = newPage;
                    }
                    loaction();
                });
            }
        }

        var loaction = function () {


            $scope.myPromise = $http.get('http://huyugui.eicp.net:4343/getSignIn', {
                params: {
                    ClassId:window.localStorage['ClassId']
                }
            }).success(function (data) {
                console.log(data);
                $scope.gridOptions.data = data;
                //alert(data)
            }).error(function (data) {

            }).finally(function () {

            });
        }
        loaction();
});