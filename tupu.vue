<template>

    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id='chart'>
        <h3 class="b h3-with-close">关系图谱</h3>
        <span class="close-icon" @click="ChangeShow">×</span>
        <hr>
        <div id="chart-panel" style="width:500px;
        height:450px;
        box-shadow: inset 0px 0px 0px 0px rgba(123, 180, 218,0.8);
        background-color:rgba(7, 65, 122, 0.95);
        border-radius: 5px;">
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import Papa from 'papaparse'
import axios from 'axios'

export default {
    name: '11',
    props: {
        selectedItems: Array, // 定义接收的prop类型
        csvData: Number,
    },
    data() {
        return {
            show:false,
            myChart: null,
            dataList: [],
            linkList: [],

        }
    },
    watch: {
        dataList(newValue) {
            this.sendData()
        },
        linkList(newValue) {
            this.sendData()
        },
        selectedItems: {
            handler: function (newValue) {
                this.updateChart();
            },
            deep: true
        },
        csvData: {
            async handler(newValue) {
                await this.readNameList()
                await this.readLinkList()
                this.updateChart()
            },
            deep: true
        },
    },

    computed: {
        coloredLinkList() {
            return this.linkList.map(link => {
                const isTargetSelected = this.selectedItems.some(item => item === link.target||item === link.source);
                return {
                    ...link,
                    lineStyle: {
                        width: 2,
                        type: 'solid',
                        curveness: 0.3,
                        opacity: 0.5,
                        color: isTargetSelected ? 'red' : 'green'
                    }
                };
            });
        },
        option() {
            return {
                tooltip: {
                    show: true, // 默认显示
                    showContent: true, // 是否显示提示框浮层
                    trigger: 'item', // 触发类型，默认数据项触发
                    triggerOn: 'mousemove', // 提示触发条件，mousemove鼠标移至触发，还有click点击触发
                    alwaysShowContent: false, // 默认离开提示框区域隐藏，true为一直显示
                    showDelay: 100, // 浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
                    hideDelay: 2000, // 浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
                    enterable: false, // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
                    position: 'right', // 提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
                    confine: false, // 是否将 tooltip 框限制在图表的区域内。
                    // 外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
                    transitionDuration: 0.2, // 提示框浮层的移动动画过渡时间，单位是秒，设置为 0 的时候会紧跟着鼠标移动。
                },
                series: [

                    {
                        type: 'graph', // 关系图
                        name: '数据传输:', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                        layout: 'force', // 图的布局，类型为力导图，'circular' 采用环形布局，见示例 Les Miserables
                        legendHoverLink: true, // 是否启用图例 hover(悬停) 时的联动高亮。
                        hoverAnimation: true, // 是否开启鼠标悬停节点的显示动画
                        coordinateSystem: null, // 坐标系可选
                        xAxisIndex: 0, // x轴坐标 有多种坐标系轴坐标选项
                        yAxisIndex: 0, // y轴坐标 
                        force: { // 力引导图基本配置
                            // initLayout: , // 力引导的初始化布局，默认使用xy轴的标点
                            repulsion: 500, // 节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                            gravity: 0.02, // 节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                            edgeLength: 200, // 边的两个节点之间的距离，这个距离也会受 repulsion影响 。值越大则长度越长
                            layoutAnimation: true // 因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画
                            // 在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。                        
                        },
                        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启，true 为都开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'
                        nodeScaleRatio: 0.6, // 鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
                        draggable: true, // 节点是否可拖拽，只在使用力引导布局的时候有用。
                        focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                        edgeSymbol: ['none', 'none'], // 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。
                        // 默认不显示标记，常见的可以设置为箭头，如下：edgeSymbol: ['circle', 'arrow']
                        edgeSymbolSize: 10, // 边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
                        itemStyle: { // ========图形样式，有 normal 和 emphasis 两个状态。
                            // normal 是图形在默认状态下的样式；
                            // emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                            normal: { // 默认样式
                                label: {
                                    show: true
                                },
                                borderType: 'solid', // 图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                                borderColor: 'rgba(205, 149, 12, 0.4)', // 设置图形边框为淡金色,透明度为0.4
                                borderWidth: 2, // 图形的描边线宽。为 0 时无描边。
                                opacity: 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                            },
                            emphasis: { // 高亮状态
                                shadowColor: 'yellow', // 阴影的颜色
                                shadowBlur: 20, // 阴影的模糊半径
                                shadowOffsetX: 0, // 阴影横向偏移量
                                shadowOffsetY: 0, // 阴影纵向偏移量
                                zlevel: 300, // 将高亮状态的zlevel设置得更高
                                z: 100 // 同时提高z值
                            }
                        },
                        label: { // ========结点图形上的文本标签
                            normal: {
                                show: true, // 是否显示标签。
                                position: 'bottom', // 标签的位置。['50%', '50%'] [x,y]
                                textStyle: { // 标签的字体样式
                                    color: '#d3d7d4', // 字体颜色 #cde6c7 #d1c7b7 #d9d6c3 #d3d7d4
                                    fontStyle: 'normal', // 文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                                    fontWeight: 'bolder', // 'normal'标准，'bold'粗的，'bolder'更粗的，'lighter'更细的，或100 | 200 | 300 | 400...
                                    fontFamily: 'sans-serif', // 文字的字体系列
                                    fontSize: 12, // 字体大小
                                },
                            },
                            emphasis: { // 高亮状态
                            }
                        },
                        edgeLabel: { // ========连接线上的文本标签 
                            normal: {
                                show: false // 不显示连接线上的文字，如果显示只能显示结点的value值，而不是连接线的值
                            },
                            emphasis: { // 高亮状态

                            }
                        },
                        categories: [ // name(类别名称)要同legend(图例）按次序一致
                            { name: '卫星' }, // 卫星使用圆形图标
                            { name: '无人机' }, // 无人机 (1)使用三角形图标
                            { name: '指挥车' }, // 指挥车使用矩形图标
                            { name: '无人车' }, // 无人车使用菱形图标
                            { name: '应急人员' }, // 应急人员使用大头针图标
                            { name: '卫星地面站' }
                        ],
                        // 设置结点node的数据
                        // category: 类别序号，从0开始
                        // name: 结点图形显示的文字
                        // symbolSize: 结点图形的大小
                        // symbol: 类目节点标记图形，默然为圆形
                        data: this.dataList,
                        links: this.coloredLinkList
                    }]
            }
        }
    },

    methods: {
        ChangeShow() {
            console.log("ChangeShow")
            this.$emit('ChangeShow',this.show)
        },
        updateChart() {
            console.log("this.option datalist", this.option.series[0].data)            
            this.myChart.setOption(this.option);
        },        
        sendData() {
            console.log("has send")
            console.log("this.dataList", this.dataList)
            console.log("this.linkList2", this.linkList)
            // console.log("this.dataList.length",this.dataList.length)
            this.$emit('sendTupuDataList', this.dataList);
            this.$emit('sendTupuLinkList', this.linkList);
        },

        async readNameList() {
            console.log("readNameList")
            await axios.get('http://localhost:8082/data/csv/nameList.csv', { responseType: 'text' }).then(res => {
                Papa.parse(res.data, {
                    complete: parsedData => {
                        parsedData = parsedData.data
                        let tmpList = [];
                        for (let i = 0; i < parsedData.length - 1; i++) {
                            let tmp = {
                                category: parsedData[i][0],
                                name: parsedData[i][1],
                                symbol: "image://tupuimg/" + parsedData[i][2] + ".png",
                                value: parsedData[i][3],
                                symbolSize: 50
                            }
                            tmpList.push(tmp)
                        }
                        this.dataList = tmpList
                        console.log("==============2==================")
                        console.log('this.dataList', this.dataList)
                    },
                });
            })

        },
        async readLinkList() {
            console.log("readLinkList")
            await axios.get('http://localhost:8082/data/csv/linkList.csv', { responseType: 'text' }).then(res => {
                Papa.parse(res.data, {
                    complete: parsedData => {
                        let tmpList = [];
                        parsedData = parsedData.data
                        for (let i = 0; i < parsedData.length - 1; i++) {
                            let tmp = {
                                source: parsedData[i][0],
                                target: parsedData[i][1],
                                value: 3
                            }
                            tmpList.push(tmp)
                        }
                        this.linkList = tmpList

                        console.log('this.linkList', this.linkList)
                    },
                });
            })
        },



        init() {
            this.readLinkList()
            this.readNameList()
            // 基于准备好的dom，初始化echarts实例
            console.log("==============================")

        }
    },

    mounted() {
        this.init()
        setTimeout(() => {
            console.log("11111111111111111111111111111111")
            console.log(this.option)
            if (this.option && typeof this.option === 'object') {
                this.myChart = echarts.init(document.getElementById('chart-panel'));
                this.myChart.setOption(this.option);
            }
        }, 1000)


    }
}

</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
}

.b {
    height: 7%;
    background-color: rgba(7, 65, 122, 0.95);
    color: #c6cee7;
    font-weight: bolder;
    position: relative;
    font-size: 20px;
    box-shadow: inset 0px 0px 5px 0px rgba(123, 180, 218, 0.8);
    border-radius: 5px;
}
.close-icon {
  position: absolute;
  right: 10px;
  top: -10px;
  color: white; 
  font-size: 40px; 
  cursor: pointer; 
}

.close-icon:hover {
  color: #cc0000; 
}
hr {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}
</style>
