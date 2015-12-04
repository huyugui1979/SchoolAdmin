'use strict';

angular.module('myApp.course', ['ngRoute', 'NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/course', {
            templateUrl: 'course/course.html',
            controller: 'courseCtrl'
        });
    }])

    .controller('courseCtrl', function ($scope, $http, ModalService, $filter) {
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            totalPage: 1
        };
        $scope.College = '';
        $scope.Profession = '';
        $scope.Classes = '';
        $scope.teacher = '';
        $scope.Message = '';


        $scope.delSubject = function (entity) {
            //
            //
            console.log(entity);
            var delDate = entity.date + ' ' + entity.BeginSubjectDate;
            console.log(delDate);
            $http.delete(URL+'deleteSubject', {
                params:{
                    ClassId: entity.SubClassId,
                    BeginSubjectDate:delDate
                }})
                .success(function (data) {
                //
                    alert('删除成功')
                    $http.get(URL + 'getProjectByProjectName', {
                        params: {
                            ClassId: entity.SubClassId,
                            SubjectName:entity.SubName
                        }})
                        .success(function (data) {
                            $scope.gridOptions.data = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });
                }).error(function (data) {

            });
            //alert(entity);
            //
        }

        $scope.gridOptions = {
            paginationPageSizes: [20, 50, 75],
            paginationPageSize: 25,
            //enableCellEditOnFocus: true,
            //showColumnFooter: true,
            //useExternalPagination: true,
            columnDefs: [
                {
                    name: '任课老师',
                    field: 'Teacher',
                    disabled: true
                    //align:center
                },
                {
                    name: '日期',
                    field: 'date',
                    disabled: true
                },
                {
                    name: '上课时间',
                    field: 'BeginSubjectDate',
                    disabled: true
                },

                {
                    name: '下课时间',
                    field: 'EndSubjectDate',
                    disabled: true
                },
                {
                    name: '删除',
                    cellTemplate: '<button class="btn btn-link" style="color: red" ng-if="row.entity.$$treeLevel != 0" ng-click="$event.stopPropagation();grid.appScope.delSubject(row.entity)">删除</button>'
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

        $scope.myPromise = $http.get(URL + 'ViewCollege', {}).success(function (data) {
            $scope.College = data
        }).error(function (data) {
            alert("服务器错误")
        }).finally(function () {

        });
        $scope.change = function (e) {

            $scope.myPromise = $http.get(URL + 'ViewProfession', {params: {CollegeId: e}})
                .success(function (data) {
                    $scope.Profession = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.change1 = function (e) {
            console.log($scope.Message.ProfessionId)
            $scope.myPromise = $http.get(URL + 'ViewClasses', {params: {ProfessionId: e}})
                .success(function (data) {
                    $scope.Classes = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.change2 = function (e) {
            console.log($scope.Message.ClassId);
            window.localStorage['SubjectClassId'] = $scope.Message.ClassId;
            $scope.myPromise = $http.get(URL + 'getClassProject', {params: {ClassId: e}})
                .success(function (data) {
                    $scope.ClassProjects = data;
                    console.log(data);
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.change3 = function (e) {
            console.log(e);
            var ids = e.split("_");
            $scope.subjectdata = ids[0];
            $scope.subjectname = ids[1];
            $scope.data = JSON.parse($scope.subjectdata);
            //console.log($scope.data);
            $scope.gridOptions.data = $scope.data;
            $scope.gridOptions.data.forEach(function (e) {
                e["SubClassId"] = window.localStorage["SubjectClassId"];
                e["SubName"] = $scope.subjectname;
                e["date"]=$filter('date')(e.BeginSubjectDate, 'yyyy-MM-dd');
                e.BeginSubjectDate = $filter('date')(e.BeginSubjectDate, 'HH:mm');
                e.EndSubjectDate = $filter('date')(e.EndSubjectDate, 'HH:mm');
            })
            console.log($scope.gridOptions.data);
        }


    })
