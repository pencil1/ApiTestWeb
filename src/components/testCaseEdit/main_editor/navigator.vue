<template>
    <div class="navigator">
        <div class="nav-bar" :style='{left:leftNum}'>
            <div class="nav-btn zoom-in" @click="zoomIn" title="放大" :class="{ 'active' : zoomRadioIn }">
                <div class="icon"></div>
            </div>
            <div class="zoom-pan">
                <div class="origin" :style="{'transform': 'translate(0, ' + getHeight(100) + 'px)'}"
                     @click="RestoreSize"></div>
                <div class="indicator" :style="{
                 'transform': 'translate(0, ' + getHeight(this.zoom) + 'px)',
                 'transition': 'transform 200ms'
                 }"></div>
            </div>
            <div class="nav-btn zoom-out" @click="zoomOut" title="缩小" :class="{ 'active' : zoomRadioOut }">
                <div class="icon"></div>
            </div>
            <div class="nav-btn hand" @click="hand" title="拖拽" :class="{ 'active' : enableHand }">
                <div class="icon"></div>
            </div>
            <div class="nav-btn camera" @click="locateToOrigin" title="定位根节点">
                <div class="icon"></div>
            </div>
            <div class="nav-btn nav-trigger" :class="{'active' : isNavOpen}" @click="toggleNavOpen" title="导航器">
                <div class="icon"></div>
            </div>
        </div>
        <div class="nav-previewer" v-show="isNavOpen"></div>

    </div>

</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import $ from "jquery";

    export default {
        name: "navigator",

        data() {
            return {
                leftNum: '420px',
                zoom: 100,
                isNavOpen: false,
                $previewNavigator: "",
                paper: "",
                nodeThumb: "",
                connectionThumb: "",
                visibleRect: "",
                contentView: "",
                visibleView: "",
                pathHandler: ""
            };
        },
        created() {
            this.$eventBus.$on('setLeftNum', (msg) => {
                this.leftNum = msg.navigatorNum

            })


        },

        computed: {
            ...mapGetters({
                minder: "getMinder",
                config: "config"
            }),

            enableHand() {
                return (
                    this.minder.queryCommandState &&
                    this.minder.queryCommandState("hand") == 1
                );
            },

            zoomRadioIn() {
                return this.getZoomRadio(this.zoom) == 0;
            },

            zoomRadioOut() {
                return this.getZoomRadio(this.zoom) == 1;
            }
        },

        methods: {
            ...mapActions(["setMemory", "getMemory"]),

            //避免缓存
            getNavOpenState() {
                var res = window.localStorage.getItem("navigator-hidden");
                return res;
            },

            zoomIn() {
                this.minder.execCommand("zoomIn");
            },

            RestoreSize() {
                this.minder.execCommand("zoom", 100);
            },

            zoomOut() {
                this.minder.execCommand("zoomOut");
            },

            hand() {
                this.minder.execCommand("hand");
            },

            getZoomRadio(value) {
                var zoomStack = this.minder.getOption && this.minder.getOption("zoom");
                if (!zoomStack) {
                    return;
                }
                var minValue = zoomStack[0];
                var maxValue = zoomStack[zoomStack.length - 1];
                var valueRange = maxValue - minValue;
                return 1 - (value - minValue) / valueRange;
            },

            getHeight(value) {
                var totalHeight = $(".zoom-pan").height();
                return this.getZoomRadio(value) * totalHeight;
            },

            locateToOrigin() {
                this.minder.execCommand("camera", this.minder.getRoot(), 600);
            },

            toggleNavOpen() {
                var self = this;

                var isNavOpen = "";
                isNavOpen = !JSON.parse(self.getNavOpenState());
                self.setMemory({
                    key: "navigator-hidden",
                    value: isNavOpen
                });
                self.isNavOpen = isNavOpen;

                setTimeout(function () {
                    if (self.isNavOpen) {
                        self.bind();
                        self.updateContentView();
                        self.updateVisibleView();
                    } else {
                        self.unbind();
                    }
                }, 100);
            },

            bind() {
                this.minder.on("layout layoutallfinish", this.updateContentView);
                this.minder.on("viewchange", this.updateVisibleView);
            },

            unbind() {
                this.minder.off("layout layoutallfinish", this.updateContentView);
                this.minder.off("viewchange", this.updateVisibleView);
            },

            getPathHandler(theme) {
                switch (theme) {
                    case "tianpan":
                    case "tianpan-compact":
                        return function (nodePathData, x, y, width, height) {
                            var r = width >> 1;
                            nodePathData.push("M", x, y + r, "a", r, r, 0, 1, 1, 0, 0.01, "z");
                        };
                    default: {
                        return function (nodePathData, x, y, width, height) {
                            nodePathData.push(
                                "M",
                                x,
                                y,
                                "h",
                                width,
                                "v",
                                height,
                                "h",
                                -width,
                                "z"
                            );
                        };
                    }
                }
            },

            updateContentView() {
                var self = this;
                var view = self.minder.getRenderContainer().getBoundaryBox();
                self.contentView = view;
                var padding = 30;

                self.paper.setViewBox(
                    view.x - padding - 0.5,
                    view.y - padding - 0.5,
                    view.width + padding * 2 + 1,
                    view.height + padding * 2 + 1
                );

                var nodePathData = [];
                var connectionThumbData = [];

                self.minder.getRoot().traverse(function (node) {
                    var box = node.getLayoutBox();
                    self.pathHandler(nodePathData, box.x, box.y, box.width, box.height);
                    if (node.getConnection() && node.parent && node.parent.isExpanded()) {
                        connectionThumbData.push(node.getConnection().getPathData());
                    }
                });

                self.paper.setStyle("background", minder.getStyle("background"));

                if (nodePathData.length) {
                    self.nodeThumb
                        .fill(minder.getStyle("root-background"))
                        .setPathData(nodePathData);
                } else {
                    self.nodeThumb.setPathData(null);
                }

                if (connectionThumbData.length) {
                    self.connectionThumb
                        .stroke(minder.getStyle("connect-color"), "0.5%")
                        .setPathData(connectionThumbData);
                } else {
                    self.connectionThumb.setPathData(null);
                }

                self.updateVisibleView();
            },

            updateVisibleView() {
                this.visibleView = this.minder.getViewDragger().getView();
                this.visibleRect.setBox(this.visibleView.intersect(this.contentView));
            }
        },

        mounted() {
            let self = this;
            let minder = self.minder;
            /**  以下部分是缩略图导航器 *
             * */

            self.$previewNavigator = $(".nav-previewer");

            // 画布，渲染缩略图
            self.paper = new kity.Paper(self.$previewNavigator[0]);

            // 用两个路径来挥之节点和连线的缩略图
            self.nodeThumb = self.paper.put(new kity.Path());
            self.connectionThumb = self.paper.put(new kity.Path());

            // 表示可视区域的矩形
            self.visibleRect = self.paper.put(
                new kity.Rect(100, 100).stroke("red", "1%")
            );

            self.contentView = new kity.Box();
            self.visibleView = new kity.Box();

            /**
             * 增加一个对天盘图情况缩略图的处理,
             * @Editor: Naixor line 104~129
             * @Date: 2015.11.3
             */

            self.pathHandler = self.getPathHandler(minder.getTheme());

            minder.setDefaultOptions({
                zoom: self.config.zoom
            });
            minder &&
            minder.on("zoom", function (e) {
                self.zoom = e.zoom;
            });

            if (self.isNavOpen) {
                self.bind();
                self.updateContentView();
                self.updateVisibleView();
            } else {
                self.unbind();
            }

            // 主题切换事件
            minder.on("themechange", function (e) {
                pathHandler = self.getPathHandler(e.theme);
                console.log(pathHandler)
            });

            navigate();

            function navigate() {
                function moveView(center, duration) {
                    var box = self.visibleView;
                    center.x = -center.x;
                    center.y = -center.y;

                    var viewMatrix = minder.getPaper().getViewPortMatrix();
                    box = viewMatrix.transformBox(box);

                    var targetPosition = center.offset(box.width / 2, box.height / 2);

                    minder.getViewDragger().moveTo(targetPosition, duration);
                }

                var dragging = false;

                self.paper.on("mousedown", function (e) {
                    dragging = true;
                    moveView(e.getPosition("top"), 200);
                    self.$previewNavigator.addClass("grab");
                });

                self.paper.on("mousemove", function (e) {
                    if (dragging) {
                        moveView(e.getPosition("top"));
                    }
                });

                $(window).on("mouseup", function () {
                    dragging = false;
                    self.$previewNavigator && self.$previewNavigator.removeClass("grab");
                });
            }
        }
    };
</script>
<style lang="scss">

</style>