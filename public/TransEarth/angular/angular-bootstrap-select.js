angular.module('angular-bootstrap-select.extra', [])
  .directive('toggle', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var target = element.parent();

        element.bind('click', function () {
          target.toggleClass('open')
        });

        element.next().find('li').bind('click', function () {
          target.toggleClass('open')
        })
      }
    };
  });

angular.module('angular-bootstrap-select-temp', [])
  .directive('selectpicker', function () {
    return {
        restrict: 'CA',
        require: '?ngModel',
        priority: 1,
        compile: function (tElement, tAttrs, transclude) {
            tElement.selectpicker();
            return function (scope, element, attrs, ngModel) {
                if(typeof ngModel!= "undefined" && ngModel != null){
                    ngModel.$render = function() {
                        element.val(ngModel.$viewValue || '').selectpicker('render');
                    };
                    ngModel.$viewValue = element.val();
                }
            };
        }
    };
  });

angular.module('angular-bootstrap-select', [])
    .directive('selectpicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.selectpicker($parse(attrs.selectpicker)());
                element.selectpicker('refresh');
                console.log("Angular Bootstrap Select Picker with Attrs: "+ attrs);
                scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                    console.log("Watch Select Picker ngModel: "+ attrs.ngModel);
                    scope.$parent[attrs.ngModel] = newVal;
                    scope.$evalAsync(function () {
                        console.log("Watch Select Picker ngOptions: "+ attrs.ngOptions);
                        if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) element.val(newVal);
                        element.selectpicker('refresh');
                    });
                });

                scope.$on('$destroy', function () {
                    scope.$evalAsync(function () {
                        element.selectpicker('destroy');
                    });
                });
            }
        };
    }]);