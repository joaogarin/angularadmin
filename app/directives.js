

/**************************
 Chart directives
 **************************/

angular.module("app.chart.directives", []).directive("gaugeChart", [
        function() {
            return {
                scope: {
                    gaugeData: "=",
                    gaugeOptions: "="
                },
                link: function(scope, ele) {
                    var data, gauge, options;

                    data = scope.gaugeData;
                        options = scope.gaugeOptions;

                        gauge = new Gauge(ele[0]).setOptions(options);
                        gauge.maxValue = data.maxValue;
                        gauge.animationSpeed = data.animationSpeed;
                        gauge.set(data.val);
                }
            };
        }
    ]).directive('chart', function () {
        var baseWidth = 600;
        var baseHeight = 400;

        return {
            restrict: 'E',
            template: '<canvas></canvas>',
            scope: {
                chartObject: "=value",
                data: "="
            },
            link: function (scope, element, attrs) {
                var canvas  = element.find('canvas')[0],
                    context = canvas.getContext('2d'),
                    chart;

                var options = {
                    type:   attrs.type   || "Line",
                    width:  attrs.width  || baseWidth,
                    height: attrs.height || baseHeight
                };
                canvas.width = options.width;
                canvas.height = options.height;
                chart = new Chart(context);

                var chartType = attrs.type;

                chart[chartType](scope.data, options);

                //Update when charts data changes
                scope.$watch(function() { return scope.chartObject; }, function(value) {
                    if(!value) return;
                    var chartType = options.type;
                    chart[chartType](scope.chartObject.data, scope.chartObject.options);
                });
            }
        };
    }).directive("flotChart", [
        function() {
            return {
                restrict: "A",
                scope: {
                    data: "=",
                    options: "="
                },
                link: function(scope, ele) {
                    var data, options, plot;
                    return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options);
                }
            };
        }
    ]).directive("flotChartRealtime", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    var data, getRandomData, plot, totalPoints, update, updateInterval;
                    return data = [], totalPoints = 300, getRandomData = function() {
                        var i, prev, res, y;
                        for (data.length > 0 && (data = data.slice(1)); data.length < totalPoints;){
                            if(data.length > 0){
                                prev = data[data.length - 1];
                            }
                            else{
                                prev = 50;
                            }
                            y = prev + 10 * Math.random() - 5;
                            if(0 > y){
                                y = 0;
                            }else{
                                if(y > 100){
                                    y = 100;
                                }
                            }
                            data.push(y);
                        }
                        for (res = [], i = 0; i < data.length;){
                            res.push([i, data[i]]);
                            ++i;
                        }
                        return res;
                    }, update = function() {
                        plot.setData([getRandomData()]);
                        plot.draw();
                        setTimeout(update, updateInterval);
                    }, data = [], totalPoints = 300, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
                        series: {
                            lines: {
                                show: !0,
                                fill: !0
                            },
                            shadowSize: 0
                        },
                        yaxis: {
                            min: 0,
                            max: 100
                        },
                        xaxis: {
                            show: !1
                        },
                        grid: {
                            hoverable: !0,
                            borderWidth: 1,
                            borderColor: "#eeeeee"
                        },
                        colors: ["#2693E9"]
                    }), update();
                }
            };
        }
    ]).directive("sparkline", [
        function() {
            return {
                scope: {
                    sparkData: "=",
                    sparkOptions: "="
                },
                link: function(scope, ele) {
                    var data, options, sparkResize, sparklineDraw;

                    data = scope.sparkData;
                        options = scope.sparkOptions;
                        sparkResize = void 0;
                        sparklineDraw = function() {

                            ele.sparkline(data, options);

                        };
                    $(window).resize(function() {
                        return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200);
                    });
                    sparklineDraw();
                }
            };
        }
    ]).directive("morrisChart", [
        function() {
            return {
                scope: {
                    data: "="
                },
                link: function(scope, ele, attrs) {
                    var colors, data, func, options,chart;
                    switch (data = scope.data, attrs.type) {
                        case "line":
                            return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                lineWidth: attrs.lineWidth || 2,
                                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"]
                            },chart = new Morris.Line(options),$(window).resize(function(){
                                chart.redraw();
                            });
                        case "area":
                            return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                lineWidth: attrs.lineWidth || 2,
                                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                behaveLikeLine: attrs.behaveLikeLine || !1,
                                fillOpacity: attrs.fillOpacity || "auto",
                                pointSize: attrs.pointSize || 4
                            }, chart = new Morris.Area(options),$(window).resize(function(){
                                chart.redraw();
                            });
                        case "bar":
                            return colors = void 0 === attrs.barColors || "" === attrs.barColors ? null : JSON.parse(attrs.barColors), options = {
                                element: ele[0],
                                data: data,
                                xkey: attrs.xkey,
                                ykeys: JSON.parse(attrs.ykeys),
                                labels: JSON.parse(attrs.labels),
                                barColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                stacked: attrs.stacked || null
                            }, chart = new Morris.Bar(options),$(window).resize(function(){
                                //chart.redraw();
                            });
                        case "donut":
                            /*jslint evil: true */
                            return colors = void 0 === attrs.colors || "" === attrs.colors ? null : JSON.parse(attrs.colors), options = {
                                element: ele[0],
                                data: data,
                                colors: colors || ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"]
                            }, attrs.formatter && (func = new Function("y", "data", attrs.formatter), options.formatter = func), chart = new Morris.Donut(options),$(window).resize(function(){
                                chart.redraw();
                            });
                    }
                }
            };
        }
    ]);



/**************************
 App ui controllers
 **************************/

angular.module("app.ui.ctrls", []).controller("NotifyCtrl", ["$scope", "loggit",
        function($scope, loggit) {
            $scope.notify = function(type) {
                switch (type) {
                    case "info":
                        return loggit.log("Hello! This is an alert of the info importance level.");
                    case "success":
                        return loggit.logSuccess("Great! You did something successfully.");
                    case "warning":
                        return loggit.logWarning("Warning! Something that happened that is not critical but important.");
                    case "error":
                        return loggit.logError("Error! Something went terribly wrong and needs your attention.");
                }
            };
        }
    ]).controller("AlertDemoCtrl", ["$scope",
        function($scope) {
            $scope.alerts = [{
                type: "success",
                msg: "Great! You did something successfully."
            }, {
                type: "info",
                msg: "Hello! This is an alert of the info importance level."
            }, {
                type: "warning",
                msg: "Warning! Something that happened that is not critical but important."
            }, {
                type: "danger",
                msg: "Error! Something went terribly wrong and needs your attention."
            }];

            $scope.addAlert = function() {
                $scope.alerts.push({msg: 'Another alert!'});
            };

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        }
    ]).controller("ProgressDemoCtrl", ["$scope",
        function($scope) {
            $scope.max = 200;

            $scope.random = function() {
                var value = Math.floor((Math.random() * 100) + 1);
                var type;

                if (value < 25) {
                    type = 'success';
                } else if (value < 50) {
                    type = 'info';
                } else if (value < 75) {
                    type = 'warning';
                } else {
                    type = 'danger';
                }

                $scope.showWarning = (type === 'danger' || type === 'warning');

                $scope.dynamic = value;
                $scope.type = type;
            };
            $scope.random();

            $scope.randomStacked = function() {
                $scope.stacked = [];
                var types = ['success', 'info', 'warning', 'danger'];

                for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
                    var index = Math.floor((Math.random() * 4));
                    $scope.stacked.push({
                        value: Math.floor((Math.random() * 30) + 1),
                        type: types[index]
                    });
                }
            };
            $scope.randomStacked();
        }
    ]).controller("AccordionDemoCtrl", ["$scope",
        function($scope) {
            return $scope.oneAtATime = !0, $scope.groups = [{
                title: "First Group Header",
                content: "First Group Body"
            }, {
                title: "Second Group Header",
                content: "Second Group Body"
            }, {
                title: "Third Group Header",
                content: "Third Group Body"
            }], $scope.items = ["Item 1", "Item 2", "Item 3"], $scope.status = {
                isFirstOpen: !0,
                isFirstOpen1: !0,
                isFirstOpen2: !0,
                isFirstOpen3: !0,
                isFirstOpen4: !0,
                isFirstOpen5: !0,
                isFirstOpen6: !0
            }, $scope.addItem = function() {
                var newItemNo;
                newItemNo = $scope.items.length + 1;
                $scope.items.push("Item " + newItemNo);
            };
        }
    ]).controller("CollapseDemoCtrl", ["$scope",
        function($scope) {
            $scope.isCollapsed = !1;
        }
    ]).controller("ModalDemoCtrl", ["$scope", "$modal", "$log",
        function($scope, $modal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]).controller("ModalInstanceCtrl", ["$scope", "$modalInstance", "items",
        function($scope, $modalInstance, items) {
            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function () {
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]).controller("PaginationDemoCtrl", ["$scope",
        function($scope) {
            $scope.totalItems = 64;
            $scope.currentPage = 4;

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
                console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.maxSize = 5;
            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
        }
    ]).controller("MapDemoCtrl", ["$scope", "$http", "$interval",
        function($scope, $http, $interval) {
            var i, markers;
            for (markers = [], i = 0; 8 > i;){
                markers[i] = new google.maps.Marker({
                    title: "Marker: " + i
                });
                i++;
            }
            $scope.GenerateMapMarkers = function() {
                var d, lat, lng, loc, numMarkers;
                for (d = new Date(), $scope.date = d.toLocaleString(), numMarkers = Math.floor(4 * Math.random()) + 4, i = 0; numMarkers > i;){
                    lat = 43.66 + Math.random() / 100;
                        lng = -79.4103 + Math.random() / 100;
                        loc = new google.maps.LatLng(lat, lng);
                        markers[i].setPosition(loc);
                        markers[i].setMap($scope.map);
                        i++;
                }
            }; $interval($scope.GenerateMapMarkers, 2e3);
        }
    ]).controller("TreeDemoCtrl", ["$scope",
        function($scope) {
            // Parameters

            $scope.list = [{
                "id": 1,
                "title": "1. dragon-breath",
                "items": []
            }, {
                "id": 2,
                "title": "2. moiré-vision",
                "items": [{
                    "id": 21,
                    "title": "2.1. tofu-animation",
                    "items": [{
                        "id": 211,
                        "title": "2.1.1. spooky-giraffe",
                        "items": []
                    }, {
                        "id": 212,
                        "title": "2.1.2. bubble-burst",
                        "items": []
                    }],
                }, {
                    "id": 22,
                    "title": "2.2. barehand-atomsplitting",
                    "items": []
                }],
            }, {
                "id": 3,
                "title": "3. unicorn-zapper",
                "items": []
            }, {
                "id": 4,
                "title": "4. romantic-transclusion",
                "items": []
            }];

            $scope.callbacks = {
            };

            $scope.remove = function(scope) {
                scope.remove();
            };

            $scope.toggle = function(scope) {
                scope.toggle();
            };

            $scope.newSubItem = function(scope) {
                var nodeData = scope.$modelValue;
                nodeData.items.push({
                    id: nodeData.id * 10 + nodeData.items.length,
                    title: nodeData.title + '.' + (nodeData.items.length + 1),
                    items: []
                });
            };
        }
    ]);



/**************************
 App custom Directives
 **************************/

angular.module("app.directives", []).directive("imgHolder", [
        function() {
            return {
                link: function(scope, ele) {
                    return Holder.run({
                        images: ele[0]
                    });
                }
            };
        }
    ]).directive("customBackground", function() {
        return {
            controller: ["$scope", "$element", "$location",
                function($scope, $element, $location) {
                    var addBg, path;
                    return path = function() {
                        return $location.path();
                    }, addBg = function(path) {
                        switch ($element.removeClass("body-home body-special body-tasks body-lock"), path) {
                            case "/":
                                return $element.addClass("body-home");
                            case "/404":
                            case "/pages/500":
                            case "/pages/signin":
                            case "/pages/signup":
                            case "/pages/forgot":
                                return $element.addClass("body-special");
                            case "/pages/lock-screen":
                                return $element.addClass("body-special body-lock");
                            case "/tasks":
                                return $element.addClass("body-tasks");
                        }
                    }, addBg($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                        return newVal !== oldVal ? addBg($location.path()) : void 0;
                    });
                }
            ]
        };
    }).directive("uiColorSwitch", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.find(".color-option").on("click", function(event) {
                        var $this, hrefUrl, style;
                        if ($this = $(this), hrefUrl = void 0, style = $this.data("style"), "loulou" === style){
                            hrefUrl = "styles/main.css";
                            $('link[href^="styles/main"]').attr("href", hrefUrl);
                        }
                        else {
                            if (!style) return !1;
                            style = "-" + style;
                            hrefUrl = "styles/main" + style + ".css";
                            $('link[href^="styles/main"]').attr("href", hrefUrl);
                        }
                        return event.preventDefault();
                    });
                }
            };
        }
    ]).directive("toggleMinNav", ["$rootScope",
        function($rootScope) {
            return {
                link: function(scope, ele) {
                    var $content, $nav, $window, Timer, app, updateClass;
                    return app = $("#app"), $window = $(window), $nav = $("#nav-container"), $content = $("#content"), ele.on("click", function(e) {

                        if(app.hasClass("nav-min")){
                            app.removeClass("nav-min");
                        }
                        else{
                            app.addClass("nav-min");
                            $rootScope.$broadcast("minNav:enabled");
                            e.preventDefault();
                        }

                    }), Timer = void 0, updateClass = function() {
                        var width;
                        return width = $window.width(), 768 > width ? app.removeClass("nav-min") : void 0;
                    }, $window.resize(function() {
                        var t;
                        return clearTimeout(t), t = setTimeout(updateClass, 300);
                    });
                }
            };
        }
    ]).directive("collapseNav", [
        function() {
            return {
                link: function(scope, ele) {
                    var $a, $aRest, $lists, $listsRest, app;
                    return $lists = ele.find("ul").parent("li"),
                        $lists.append('<i class="fa fa-arrow-circle-o-right icon-has-ul"></i>'),
                        $a = $lists.children("a"),
                        $listsRest = ele.children("li").not($lists),
                        $aRest = $listsRest.children("a"),
                        app = $("#app"),
                        $a.on("click", function(event) {
                            var $parent, $this;
                            return app.hasClass("nav-min") ? !1 : ($this = $(this),
                                $parent = $this.parent("li"),
                                $lists.not($parent).removeClass("open").find("ul").slideUp(),
                                $parent.toggleClass("open").find("ul").stop().slideToggle(), event.preventDefault());
                        }), $aRest.on("click", function() {
                        return $lists.removeClass("open").find("ul").slideUp();
                    }), scope.$on("minNav:enabled", function() {
                        return $lists.removeClass("open").find("ul").slideUp();
                    });
                }
            };
        }
    ]).directive("highlightActive", [
        function() {
            return {
                controller: ["$scope", "$element", "$attrs", "$location",
                    function($scope, $element, $attrs, $location) {
                        var highlightActive, links, path;
                        return links = $element.find("a"), path = function() {
                            return $location.path();
                        }, highlightActive = function(links, path) {
                            return path = "#" + path, angular.forEach(links, function(link) {
                                var $li, $link, href;
                                return $link = angular.element(link), $li = $link.parent("li"), href = $link.attr("href"), $li.hasClass("active") && $li.removeClass("active"), 0 === path.indexOf(href) ? $li.addClass("active") : void 0;
                            });
                        }, highlightActive(links, $location.path()), $scope.$watch(path, function(newVal, oldVal) {
                            return newVal !== oldVal ? highlightActive(links, $location.path()) : void 0;
                        });
                    }
                ]
            };
        }
    ]).directive("toggleOffCanvas", [
        function() {
            return {
                link: function(scope, ele) {
                    return ele.on("click", function() {
                        return $("#app").toggleClass("on-canvas");
                    });
                }
            };
        }
    ]).directive("slimScroll", [
        function() {
            return {
                link: function(scope, ele, attrs) {
                    return ele.slimScroll({
                        height: attrs.scrollHeight || "100%"
                    });
                }
            };
        }
    ]).directive("goBack", [
        function() {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$window",
                    function($scope, $element, $window) {
                        return $element.on("click", function() {
                            return $window.history.back();
                        });
                    }
                ]
            };
        }
    ]);



/**************************
 App Form Ui Directives
 **************************/

angular.module("app.ui.form.directives", []).directive("uiRangeSlider", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.slider();
                }
            };
        }
    ]).directive("uiFileUpload", [
        function() {
            return {
                restrict: "A",
                link: function(scope, ele) {
                    return ele.bootstrapFileInput();
                }
            };
        }
    ]).directive("uiSpinner", [
        function() {
            return {
                restrict: "A",
                compile: function(ele) {
                    return ele.addClass("ui-spinner"), {
                        post: function() {
                            return ele.spinner();
                        }
                    };
                }
            };
        }
    ]).directive("uiWizardForm", [
        function() {
            return {
                link: function(scope, ele) {
                    return ele.steps();
                }
            };
        }
    ]);

