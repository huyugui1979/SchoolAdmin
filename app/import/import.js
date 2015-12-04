/**
 * Created by fish on 15/10/29.
 */
angular.module('myApp.import', ['ngRoute', 'cipchk', 'NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/import', {
            templateUrl: 'import/import.html',
            controller: 'importCtrl'
        });
    }])
    .controller('importCtrl', function ($scope, $http, fileDialog, Upload) {

        var vm = this;
        vm.gridOptions = {};

        $scope.Message = {
            CollegeId: '',
            ProfessionId: '',
            ClassId: '5659538c260f6fb6f226df57',
            TeacherId: window.localStorage['TeacherId']
        }

        $scope.yuan = '';
        $scope.ye = '';

        $scope.changePortait = function () {
            fileDialog.openFile(function (e) {

                var files = e.target.files;
                $scope.myPromise = Upload.upload({
                    url: URL + 'UploadExcel',
                    fields: {'postImg': 'default'},
                    file: files[0]
                })
                    .progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        if (progressPercentage === 100) {
                            alert("导入成功" + evt.config.file.name);
                        }

                    }).success(function (data, status, headers, config) {

                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
            });
        }

        $http.get(URL + 'ChooseCollege', {}).success(function (data) {
            $scope.yuan = data
            console.log(data);
        }).error(function (data) {

        }).finally(function () {

        });

        $scope.change = function (e) {
            console.log(e);
            $http.get(URL + 'ChooseProfession', {params: {CollegeId: e}})
                .success(function (data) {
                    $scope.ye = data;
                    console.log(data)
                }).error(function (data) {

                }).finally(function () {

                });
        }

        $scope.send = function () {
                $http.post(URL + 'AddStudentIntoDB', $scope.Message)
                    .success(function (data) {
                        alert("保存成功")
                    }).error(function (data) {

                    }).finally(function () {

                    });
            //if ($scope.Message.CollegeId === '') {
            //    alert("请选择学院")
            //} else if ($scope.Message.ProfessionId === '') {
            //    alert("请选择专业")
            //} else {
            //    $http.post(URL + 'AddStudentIntoDB', $scope.Message)
            //        .success(function (data) {
            //            alert("保存成功")
            //        }).error(function (data) {
            //
            //        }).finally(function () {
            //
            //        });
            //}
        }
    })


