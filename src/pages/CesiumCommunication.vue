<template>
  <div class="modal" v-show="imgLoading" style="
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 502;
      width: 100%;
      height: 100%;
      margin:0px;
      position: absolute;
    ">
    <span style="position: absolute; width: 20%; margin-top: 20%; color: #409eff">
      等待中...
    </span>
    <el-progress :percentage="$store.state.upLoadProgress" style="width: 30%; margin-left: 35%; margin-top: 22%">
    </el-progress>
  </div>
  <input v-show="false" ref="uploadGeoJSON" type="file" style="margin-top: 10px" name="file" id="file" accept=".geojson"
    @change="ChooseFile($event)" />
  <el-button v-show="handImport" style="position: absolute; left: 8vw; top: 230px; z-index: 2200" type="primary"
    size="mini" @click.prevent="importGeoJSON" link>手动导入GeoJSON文件
  </el-button>
  <!-- <el-button v-show="handImport" style="position: absolute;left:120px ;top: 500px;z-index: 2200;" type="primary"
			size="mini" @click.prevent="nomain" link>获取设备实时点位
		</el-button> -->

  <div class="operationTable">
    <!-- <div
				style=" color: #565656;text-align:center; font-size: 23px; font-weight: bold;margin-top: 10px;margin-bottom: 15px;">
				项目面板
			</div> -->
    <div class="panel">
      <label style="margin-left: 12px; font-size: 13px">选择区域</label>
      <el-select placeholder="请选择一个区域" filterable v-model="inviteCode" style="
          margin-top: 10px;
          margin-left: 5px;
          width: 270px;
          margin-bottom: 15px;
        " size="mini">
        <el-option v-for="item in projectOptions" :key="item.projectInviteCode" :label="item.title"
          :value="item.projectInviteCode">
        </el-option>
      </el-select>
      <hr />
      <label style="font-size: 15px; font-weight: bold">已选电台点位</label>

      <el-table :data="radioPos"  empty-text=" "
        style="width: 100%; height: 200px;  margin-top: 10px; background-color: #19284b; font-size: 12px;"
        default-expand-all stripe size="mini" row-key="index" ref="multipleTable"
        @selection-change="handleSelectionChange1">
        <el-table-column type="selection" width="30" :selectable="selectable1" />
        <el-table-column label="序号" width="50" align="center" type="index">
        </el-table-column>
        <el-table-column label="经度" width="97" align="center" prop="lon">
        </el-table-column>
        <el-table-column label="纬度" width="97" align="center" prop="lat">
        </el-table-column>
        <el-table-column label="高程" width="60" align="center" prop="height">
        </el-table-column>
        <el-table-column align="right" label="操作" width="60">
          <template #default="scope">
            <el-button size="mini" @click.prevent="handleCheck(scope.$index, scope.row)" link>查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="right" label="选择" width="120">
          <template #default="scope">
            <el-select v-model=this.radioLinkTupu[scope.$index] placeholder="Select">
              <el-option v-for="item in optionsForTupu" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button size="mini" @click.prevent="handleDelete(scope.$index, scope.row)" link style="color: red">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex">
        <el-button size="small"  v-show="!this.sign" style="width: 90px; margin-top: 10px; margin-left: 4%; color: #00aaff"
          @click="StartSign">
          {{ signBtnName }}
        </el-button>
        <el-button size="small" style="float: left; margin-top: 10px; margin-left: 4%; color: #00aaff"
          @click="toGeoJSON">
          导出坐标点
        </el-button>
        <el-button size="small" style="float: left; margin-top: 10px; margin-left: 4%; color: #00aaff"
          @click="uploadRadioPos">
          分析
        </el-button>
        <el-button size="small" style="float: left; margin-top: 10px; margin-left: 4%; color: #00aaff" @click="SaveImg">
          保存结果
        </el-button>
      </div>
    </div>
    <hr />
    <div style="display: flex; flex-direction: column">
      <div style="font-size: 11px; display: flex;justify-content: space-around;">
        <div class='text-min'>
          <span class="text-span">最大可用地面点数量 </span>
          <el-input-number v-model="maxGroundNum" :precision="0" :max="200" size="small" :controls="false"
            style="width: 35%" />
        </div>

        <div class='text-min'>
          <span class="text-span">地面最大允许架高值<span style="color:#19284b ;">---</span></span>
          <el-input-number v-model="maxGroundHeight" :precision="2" :max="200" size="small" :controls="false"
            style="width: 35%" />
        </div>
      </div>
      <div style="font-size: 11px; display: flex;justify-content: space-around;">
        <div class='text-min'> <span class="text-span">最大可用空中点数量 </span><el-input-number v-model="maxFlyNum"
            :precision="0" :max="200" size="small" :controls="false" style="width: 35%" /></div>
        <div class='text-min'> <span class="text-span">空中节点最大飞行高度</span><el-input-number v-model="maxFlyHeight"
            :precision="2" :max="500" size="small" :controls="false" style="width: 35%" /></div>

      </div>
      <div style="font-size: 11px;display: flex;justify-content: space-around;">
        <div class='text-min'> <span class="text-span">通信覆盖范围<span style="color:#19284b ;">--------</span></span><el-input-number v-model="maxComputeRadioDistance"
            :precision="0" :max="10000" size="small" :controls="false" style="width: 35%" /></div>
        <div class='text-min'> <span class="text-span">采样点间隔<span style="color:#19284b ;">--------------</span></span><el-input-number v-model="samplePointInterval"
            :precision="2" :max="500" size="small" :controls="false" style="width: 35%;" /></div>

      </div>
    </div>

    <div style="display: flex; justify-content: space-around; margin-top: 5px">
      <el-button style="float: left;" @click="showTupu">知识图谱</el-button>
      <el-button style="float: left" @click="analysePlanRadio">补点分析</el-button>
      <el-button style="float: left" @click="continueUpload">继续更新</el-button>
    </div>

    <el-table :data="planRadio" empty-text=" " style="
        width: 100%;
        height: 100px;
        margin-top: 10px;
        overflow-y: auto;
        overflow-x:auto ;
        font-size: small;
        background-color: #19284b;
      " row-key="index" default-expand-all stripe size="mini" @selection-change="handleSelectionChange2">
      <el-table-column type="selection" width="55" :selectable="selectable2" />
      <el-table-column label="序号" width="50" align="center" type="index">
      </el-table-column>
      <el-table-column label="类型" width="50" align="center" prop="prtype">
      </el-table-column>
      <el-table-column label="经度" width="97" align="center" prop="lon">
      </el-table-column>
      <el-table-column label="纬度" width="97" align="center" prop="lat">
      </el-table-column>
      <el-table-column label="高度" width="60" align="center" prop="height">
      </el-table-column>

      <el-table-column align="right" label="选择" width="120">
        <template #default="scope">
          <el-select v-model=this.radioLinkTupu[scope.$index] placeholder="Select">
            <el-option v-for="item in optionsForTupu" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column>
        <template #default="scope">
          <el-button size="mini" @click.prevent="handleDelPrinfo(scope.$index, scope.row)" link style="color: red">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-around; margin-top: 5px;">
      <el-span style="font-size: 13px;">节点</el-span>
      <el-input type="text" v-model="point" placeholder="请输入名称" style="font-size: 13px;height: 30px; width:150px;"></el-input>
       <el-select v-model="Typeclass"  style="font-size: 10px; height: 30px;width:150px;" >
        <el-option v-for="item in pointClass" :key="item" :value="item"></el-option>
      </el-select>
      <el-button style="float: left;font-size: 13px;" @click="addPoint">增添</el-button>
      <el-button style="float: left;font-size: 13px;" @click="deletePoint">删除</el-button>

    </div>
    <div style="display: flex; justify-content: space-around; margin-top: 5px">
      <el-span style="font-size: 13px;">关系</el-span>
       <el-input type="text" v-model="nodeFrom" placeholder="起点" style="font-size: 13px; height: 30px;width:150px;"></el-input>
      <el-input type="text" v-model="nodeTo" placeholder="终点" style="font-size: 13px;height: 30px;width:150px;"></el-input>
      <el-button style="float: left;font-size: 13px;" @click="addLink">增添</el-button>
      <el-button style="float: left;font-size: 13px;" @click="deleteLink">删除</el-button>
    </div>
    <div style="display: flex; justify-content: space-around; margin-top: 5px">
      <el-button size="small" v-show="!this.signMode" style="width:40% ; float: left;margin-left: 12px; color: #00aaff;height: 30px"
          @click="StartSign1">
          {{ signName }}
        </el-button> 
        <el-button v-show="this.sign" style="float: left" @click="K_means">K_means</el-button>
        <el-button v-show="this.sign" style="float: left" @click="DBSCAN">DBSCAN</el-button>
    </div>
    <div style="display: flex; justify-content: space-around; margin-top: 5px">
      <el-input type="text" v-show="this.sign" v-model="K_number" placeholder="K值正整数)" style="font-size: 13px;float:left; "></el-input>
      <el-input type="text" v-show="this.sign" v-model="eps" placeholder="eps(邻域半径)" style="font-size: 13px;float:left; "></el-input>
      <el-input type="text" v-show="this.sign" v-model="minPts" placeholder="minPts(正整数)" style="font-size: 13px;float:left;"></el-input>
     
    </div>
  </div>
  <tupu style="position: absolute;width: 350px;height: 350px;left:25vw;top:200px;z-index: 114514;"
    v-show=this.isShowTupu @sendTupuDataList="handleTupuSend" @sendTupuLinkList="handleLinkList" @ChangeShow="handleShow"
    :selected-items="this.radioLinkTupu" :csvData="csvData"></tupu>


  <div id="container" class="cesiumbox" style="">
    <div id="cesiumContainer" :style="cesiumStyle">
      <el-button class="Change" type="primary" size="mini" @click="changeLayer"
        :style="{ backgroundImage: 'url(' + changeIconUrl + ')' }">
      </el-button>
      <el-button class="Hide" type="primary" size="mini" @click="HideImg"
        :style="{ backgroundImage: 'url(' + hideIconUrl + ')' }">
      </el-button>
      <el-button class="Resize" type="primary" size="mini" @click="Resize">
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>
<script>
import { number } from 'echarts';
import tupu from './tupu.vue'
import axios from 'axios';

export default {
  components: {
    tupu
    // ElTable,
    // ElTableColumn,
    // ElInput,
    // ElInputNumber,
  },
  name: 'CesiumContainer',
  props: {
    msg: String
  },
  data() {
    return {
      // linkList: [],
      colorPalette:[
  Cesium.Color.AQUA,
  Cesium.Color.AQUAMARINE,
  Cesium.Color.AZURE,
  Cesium.Color.BEIGE,
  Cesium.Color.BISQUE,
  Cesium.Color.BLACK,
  Cesium.Color.BLUE,
  Cesium.Color.BLUEVIOLET,
  Cesium.Color.BROWN,
  Cesium.Color.CADETBLUE,
  Cesium.Color.CHARTREUSE,
  Cesium.Color.CHOCOLATE,
  Cesium.Color.CORAL,
  Cesium.Color.CORNFLOWERBLUE,
  Cesium.Color.CORNSILK,
  Cesium.Color.CRIMSON,
  Cesium.Color.CYAN,
  Cesium.Color.DARKGOLDENROD,
  Cesium.Color.DARKGREEN,
  Cesium.Color.DARKKHAKI,
  Cesium.Color.DARKMAGENTA,
  Cesium.Color.DARKOLIVEGREEN,
  Cesium.Color.DARKORANGE,
  Cesium.Color.DARKORCHID,
  Cesium.Color.DARKRED,
  Cesium.Color.DARKSALMON,
  Cesium.Color.DARKSEAGREEN,
  Cesium.Color.DARKSLATEBLUE,
  Cesium.Color.DARKSLATEGREY,
  Cesium.Color.DARKTURQUOISE,
  Cesium.Color.DARKVIOLET,
  Cesium.Color.DEEPPINK,
  Cesium.Color.DEEPSKYBLUE,
  Cesium.Color.DIMGREY,
  Cesium.Color.DODGERBLUE,
  Cesium.Color.FIREBRICK,
  Cesium.Color.FLORALWHITE,
  Cesium.Color.FORESTGREEN,
  Cesium.Color.FUCHSIA,
  Cesium.Color.GAINSBORO,
  Cesium.Color.GHOSTWHITE,
  Cesium.Color.GOLD,
  Cesium.Color.GOLDENROD,
  Cesium.Color.GREY,
  Cesium.Color.GREENYELLOW,
  Cesium.Color.HONEYDEW,
  Cesium.Color.HOTPINK,
  Cesium.Color.INDIGO,
  Cesium.Color.IVORY,
  Cesium.Color.KHAKI,
  Cesium.Color.LAVENDER,
  Cesium.Color.LAVENDERBLUSH,
  Cesium.Color.LAWNGREEN,
  Cesium.Color.LEMONCHIFFON,
  Cesium.Color.LIGHTBLUE,
  Cesium.Color.LIGHTCORAL,
  Cesium.Color.LIGHTCYAN,
  Cesium.Color.LIGHTGOLDENRODYELLOW,
  Cesium.Color.LIGHTGREEN,
  Cesium.Color.LIGHTPINK,
  Cesium.Color.LIGHTSALMON,
  Cesium.Color.LIGHTSEAGREEN,
  Cesium.Color.LIGHTSKYBLUE,
  Cesium.Color.LIGHTSLATEGREY,
  Cesium.Color.LIGHTSTEELBLUE,
  Cesium.Color.LIGHTYELLOW,
  Cesium.Color.LIME,
  Cesium.Color.LIMEGREEN,
  Cesium.Color.LINEN,
  Cesium.Color.MAGENTA,
  Cesium.Color.MAROON,
  Cesium.Color.MEDIUMAQUAMARINE,
  Cesium.Color.MEDIUMBLUE,
  Cesium.Color.MEDIUMORCHID,
  Cesium.Color.MEDIUMPURPLE,
  Cesium.Color.MEDIUMSEAGREEN,
  Cesium.Color.MEDIUMSLATEBLUE,
  Cesium.Color.MEDIUMSPRINGGREEN,
  Cesium.Color.MEDIUMTURQUOISE,
  Cesium.Color.MEDIUMVIOLETRED,
  Cesium.Color.MIDNIGHTBLUE,
  Cesium.Color.MINTCREAM,
  Cesium.Color.MISTYROSE,
  Cesium.Color.MOCCASIN,
  Cesium.Color.NAVAJOWHITE,
  Cesium.Color.NAVY,
  Cesium.Color.OLDLACE,
  Cesium.Color.OLIVE,
  Cesium.Color.OLIVEDRAB,
  Cesium.Color.ORANGE,
  Cesium.Color.ORANGERED,
  Cesium.Color.ORCHID,
  Cesium.Color.PALEGOLDENROD,
  Cesium.Color.PALEGREEN,
  Cesium.Color.PALETURQUOISE,
  Cesium.Color.PALEVIOLETRED,
  Cesium.Color.PAPAYAWHIP,
  Cesium.Color.PEACHPUFF,
  Cesium.Color.PERU,
  Cesium.Color.PINK,
  Cesium.Color.PLUM,
  Cesium.Color.POWDERBLUE,
  Cesium.Color.PURPLE,
  Cesium.Color.REBECCAPURPLE,
  Cesium.Color.RED,
  Cesium.Color.ROSYBROWN,
  Cesium.Color.ROYALBLUE,
  Cesium.Color.SADDLEBROWN,
  Cesium.Color.SALMON,
  Cesium.Color.SANDYBROWN,
  Cesium.Color.SEAGREEN,
  Cesium.Color.SEASHELL,
  Cesium.Color.SIENNA,
  Cesium.Color.SILVER,
  Cesium.Color.SKYBLUE,
  Cesium.Color.SLATEBLUE,
  Cesium.Color.SLATEGREY,
  Cesium.Color.SNOW,
  Cesium.Color.SPRINGGREEN,
  Cesium.Color.STEELBLUE,
  Cesium.Color.TAN,
  Cesium.Color.TEAL,
  Cesium.Color.THISTLE,
  Cesium.Color.TOMATO,
  Cesium.Color.TURQUOISE,
  Cesium.Color.VIOLET,
  Cesium.Color.WHEAT,
  Cesium.Color.WHITE,
  Cesium.Color.WHITESMOKE,
  Cesium.Color.YELLOW,
  Cesium.Color.YELLOWGREEN,
    ],
      currentPolygonEntity: [],
      clusters:null,
      K_number:null,
      eps:null,
      minPts:null,
      pointClass:['卫星','无人机','无人车','应急人员','指挥车','地面接收站'],
      Typeclass:[],
      Ground:[],
      fly: [],
      radioLinkTupu: [],
      tupuLinkList: null,
      tupuDataList: null,
      optionsForTupu: [],
      csvData:1,//用来给tupu子组件刷新
      point: '',
      nodeFrom: '',
      nodeTo: '',
      isShowTupu: false,
      maxComputeRadioDistance: 1000,
      samplePointInterval: 5,
      selectedItems: [],
      otherRadioIpGpsList: {}, //{"ip":{"lon":lon,"lat":lat,"height":height}}
      radioLinkTupuEntity: [], //['应急人员1'， '无人机2'] 序号按照radioPos中的序号
      msctoken: null,
      hideIconUrl: './view.png',
      changeIconUrl: './street.png',
      isStreetLayer: false,
      guilinStreetLayer: null,
      nanningStreetLayer: null,
      wuhanStreetLayer: null,
      isAnalying: false,
      rectangles: [],
      rectangleEntities: [],
      isRunning: false,
      tifname: 'guangxi_guilin_dsmWGS84_5.tif',
      done: 0,
      processBarPercent: 0,

      signPointLongitude: null,
      signPointLatitude: null,
      signPointHeight: null,

      previewPath: '',
      previewVisible: false,
      hideUpload: false,
      limitCount: 1,
      imgFileList: [],

      headFile: '',

      para: [],
      dialogFormVisible: false,
      dialogFormVisibleSignPoint: false,
      signMode: false,
      sign:false,
      viewer: null,
      Cesium: null,
      projectOptions: [
        {
          projectInviteCode: 1,
          title: '广西桂林'
        },
        {
          projectInviteCode: 2,
          title: '广西南宁'
        },
        {
          projectInviteCode: 3,
          title: '湖北武汉'
        }
      ],
      inviteCode: '',
      radioToEntity: { "节点1": "无人机1" },
      radioPos: [],
      radioPosLength: 0,
      rectangle: null,
      rectangle2: null,
      resultLayers: [],
      rectEast: 0,
      rectWest: 0,
      rectSouth: 0,
      rectNorth: 0,
      currentMousePos1: null,
      currentMousePos2: null,
      search: '',
      rsImgEntity: null,
      radioEntities: [],
      imgLoading: false,
      upLoadProgress: 20,
      intervalBox: null,
      xxxb_tileset: null,
      wlxb_tileset: null,
      primitiveManager: null,
      entityResult: null,
      resultImgName: '',
      //liubocai
      gatewayUrl: 'https://192.168.5.100:7715',
      username: '1101',
      password: '000000',
      mClient: null,
      sdkclient: null,
      mConnected: false,
      devNameDict: {},
      devOnlineListName: [],
      devOnlineList: [],
      deviceOnlineGpsList: {},
      nowradioPosIndex: -1,
      timer: null,
      //新需求，能够设定要添加的电台数量和高度
      tableData: [{ name: '', age: '' }],
      form: { id: 'qwe', name: 'qwe', type: '地面', height: 'eqw' },
      useableGroundRadioNum: 1,
      useableAirRadioNum: 1,
      maxGroundHeight: 15,
      maxFlyHeight: 100,
      maxGroundNum: 0,
      maxFlyNum: 0,
      planRadio: [
        // {prtype:"地面", height:"114.1", lon:"114.123456", lat:"30.123456"},
      ],
      chosenPrType: '',
      prtypeOptions: [
        { prtypeIndex: 1, title: '地面' },
        { prtypeIndex: 2, title: '空中' }
      ],
      prHeightNum: 0,
      lineEntities: [],
      lines: [],
      radioposUpload: []
    };
  },
  watch: {
    radioLinkTupu:{
      handler(newValue) {
      let j=0;
      for(let i=0;i<this.fly.length;i++){
        newValue.some(item => {
         if( this.fly[i].value === item){
          j++;
         }
        })
      }
      let k=0
      for(let i=0;i<this.Ground.length;i++){
       newValue.some(item => {
          if(this.Ground[i].value === item){
            k++;
          }
        })
      }
      this.maxGroundNum=this.Ground.length-k
      this.maxFlyNum=this.fly.length-j
    },
    deep: true,
  },
    resultImgName(newValue) {
      // this.entityResult.rectangle.material = newValue;
      // this.entityResult.rectangle.material.image = newValue;
      // console.log("监听到变化了！!!!!");
      // this.ReloadAllMarkers();
      // this.viewer.scene.requestRender();
    },
    inviteCode(newValue) {
      if (newValue == 1) {
        // this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        // 	url: "http://192.168.10.167:8082/data/terraintiles/guangxi_guilin_dsmtiles/",
        // 	// url: "http://192.168.10.167:8080/terrain/guangxi_guilin_dsmtiles/",
        // 	requestVertexNormals: true
        // })
        // this.viewer.camera.flyTo({
        // 	destination: this.Cesium.Cartesian3.fromDegrees(110.43, 25.31, 10000),
        // 	duration: 1.5
        // })
        this.viewer.scene.primitives.show = true;
        this.viewer.camera.flyTo({
          destination: new Cesium.Cartesian3.fromDegrees(
            110.1948,
            25.28473,
            300
          ),
          duration: 1.5
        });
        this.tifname = 'guangxi_guilin_dsmWGS84_5.tif';
      } else if (newValue == 2) {
        this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url: 'http://192.168.10.167:8082/data/terraintiles/guangxi_nanning_dsmtiles/',
          // url: "http://192.168.10.167:8080/terrain/guangxi_nanning_dsmtiles/",

          requestVertexNormals: true
        });
        this.tifname = 'guangxi_nanning_dsmCGCS2k.tif';
        this.viewer.camera.flyTo({
          destination: this.Cesium.Cartesian3.fromDegrees(108.33, 22.8, 10000),
          duration: 1.5
        });
      } else if (newValue == 3) {
        this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url: 'http://192.168.10.167:8082/data/terraintiles/wuhan_dsmtiles/',
          // url: 'http://192.168.10.167:8080/terrain/wuhan_dsmtiles/',
          requestVertexNormals: true
        });
        this.viewer.camera.flyTo({
          destination: this.Cesium.Cartesian3.fromDegrees(114.35, 30.52, 10000),
          duration: 1.5
        });
        this.tifname = 'wuhan_dsm_114_dsmCGCS2k_30.tif';
      }
    }
  },
  computed: {
//     randomColor() {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return Cesium.Color.rgb(r,g,b).withAlpha(0.5);
// },

    handImport() {
      if (this.radioPosLength == 0) {
        return true;
      } else {
        return false;
      }
    },
    signBtnName() {
      if (this.signMode) {
        return '选择完成';
      } else {
        return '选择电台点位';
      }
    },
    signName(){
      if (this.sign) {
        return '完成（可以进行聚类）';
      } else {
        return '开始选择点(不可聚类)';
      }
    },
    loadingMsg() {
      return this.$store.state.loadingMsg;
    },
    cesiumStyle() {
      if (this.signMode) {
        return {
          cursor: 'crosshair'
        };
      } else if(this.sign){
        return {
          cursor: 'crosshair'
        }
      }else{
        return{
          
        }
      }
    }
  },
  methods: {
    async DBSCAN(){
      if (this.currentPolygonEntity) {
      if (Array.isArray(this.currentPolygonEntity)) {
        this.currentPolygonEntity.forEach(entity => {
          this.viewer.entities.remove(entity);
        });
      } else {
        this.viewer.entities.remove(this.currentPolygonEntity);
      }
    }
    if(this.eps<=0){
      alert("请输入正确的eps值")
      return
    }else if(this.minPts<=0&&this.minPts>temp.length-1){
      alert("请输入正确的minPts值")
      return
    }
    const temp=[]
    this.radioPos.forEach(item => temp.push([item.lat, item.lon]));

    try {
               const response = await axios.post(`${this.$store.state.serverurl}/DBSCAN`, {
                        data: temp,
                        eps: Number(this.eps),
                        min_samples: Number(this.minPts)
                 }, {
                 headers: {
                      'Content-Type': 'application/json' 
                 }
                 });
                this.clusters =await response.data;
                console.log('Clusters:', this.clusters);
                
                for(let i = 0; i < this.K_number; i++) {
                    if(this.clusters[i].length <=1){
                       continue
                      }
                let minLon = Infinity, maxLon = -Infinity;
                let minLat = Infinity, maxLat = -Infinity;
                this.clusters[i].forEach(point => {
                minLon = Math.min(minLon, point[1]);
                maxLon = Math.max(maxLon, point[1]);
                minLat = Math.min(minLat, point[0]);
                maxLat = Math.max(maxLat, point[0]);
                });

                const boundingBoxPoints = [
                      Cesium.Cartesian3.fromDegrees(minLon, minLat),
                      Cesium.Cartesian3.fromDegrees(maxLon, minLat), 
                      Cesium.Cartesian3.fromDegrees(maxLon, maxLat), 
                      Cesium.Cartesian3.fromDegrees(minLon, maxLat), 
  ];
                boundingBoxPoints.push(boundingBoxPoints[0]);
                const color = this.colorPalette[i % this.colorPalette.length].withAlpha(0.5);
                const boundingPolygon = new Cesium.PolygonGraphics({
                  hierarchy: boundingBoxPoints,
                  material: color, 
                  outline: true,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2
                });
                const entity = this.viewer.entities.add({
                         polygon: boundingPolygon
                });
                this.currentPolygonEntity.push(entity);
}
      } catch (error) {
      console.error('获取聚类数据时出错:', error);
      alert('获取聚类数据失败，请检查网络或服务器状态');
    }
    },
  async K_means() {
      if (this.currentPolygonEntity) {
      if (Array.isArray(this.currentPolygonEntity)) {
        this.currentPolygonEntity.forEach(entity => {
          this.viewer.entities.remove(entity);
        });
      } else {
        this.viewer.entities.remove(this.currentPolygonEntity);
      }
    }
    if(this.K_number<1){  
      alert("请输入正确的聚类数")
      return 
    }
      const temp=[]
    this.radioPos.forEach(item => temp.push([item.lat, item.lon]));
      if (this.K_number > 0 && this.radioPos.length > 0) {
          try {
               const response = await axios.post(`${this.$store.state.serverurl}/Km`, {
                        data: temp,
                        K: Number(this.K_number)
                 }, {
                 headers: {
                      'Content-Type': 'application/json' 
                 }
                 });
                this.clusters =await response.data;
                console.log('Clusters:', this.clusters);
                
                for(let i = 0; i < this.K_number; i++) {
                    if(this.clusters[i].length <=1){
                       continue
                      }
                let minLon = Infinity, maxLon = -Infinity;
                let minLat = Infinity, maxLat = -Infinity;
                this.clusters[i].forEach(point => {
                minLon = Math.min(minLon, point[1]);
                maxLon = Math.max(maxLon, point[1]);
                minLat = Math.min(minLat, point[0]);
                maxLat = Math.max(maxLat, point[0]);
                });

                const boundingBoxPoints = [
                      Cesium.Cartesian3.fromDegrees(minLon, minLat),
                      Cesium.Cartesian3.fromDegrees(maxLon, minLat), 
                      Cesium.Cartesian3.fromDegrees(maxLon, maxLat), 
                      Cesium.Cartesian3.fromDegrees(minLon, maxLat), 
  ];
                boundingBoxPoints.push(boundingBoxPoints[0]);
                const color = this.colorPalette[i % this.colorPalette.length].withAlpha(0.5);
                const boundingPolygon = new Cesium.PolygonGraphics({
                  hierarchy: boundingBoxPoints,
                  material: color, 
                  outline: true,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2
                });
                const entity = this.viewer.entities.add({
                         polygon: boundingPolygon
                });
                this.currentPolygonEntity.push(entity);
}
      } catch (error) {
      console.error('获取聚类数据时出错:', error);
      alert('获取聚类数据失败，请检查网络或服务器状态');
    }
  } else {
    alert("请先选择K值和点位");
  }
},   
 handleShow(msg){
      console.log("handleShow",msg)
      this.isShowTupu=!this.isShowTupu
  
    },
    async addPoint() {
      const typeMapping = {
        '无人机': { category: '1', imgName: '无人机' },
        '应急人员': { category: '4', imgName: '应急人员' },
        '卫星': { category: '0', imgName: '卫星云图' }, // 或者更改类别
        '无人车': { category: '3', imgName: '无人车' },
        '指挥车': { category: '2', imgName: '指挥车' },
        '地面接收站': { category: '5', imgName: '卫星地面接收站' },
      };
      if(this.tupuDataList.some(item => item.name === this.point)){
        alert("该点位已存在") 
        
      }else{
        const number='3'
        let category, imgName;
        const mappingResult = typeMapping[this.Typeclass];
        if (mappingResult) {
          category = mappingResult.category;
          imgName = mappingResult.imgName;
        } else {
          console.error('Invalid type:', type);
        }
        this.tupuDataList.push({ category, name: this.point, symbol: "image://tupuimg/" + imgName + ".png", value:number, symbolSize: 50 });
        // this.csvData=this.tupuDataList;
        await axios.post(`${this.$store.state.serverurl}/csvNode?category=${category}&name=${this.point}&imgName=${imgName}&value=${number}}`)
          .then(response => {
            console.log(response.data);
            this.csvData=this.csvData+1
          })
          .catch(error => {
            console.error(error);
          });

      console.log("this.csvData change", this.csvData);
      }
    },
    async deletePoint() {
      const point = this.point;
      const Bool = this.tupuDataList.some(item => item.name === point&&item.symbol=="image://tupuimg/"+this.Typeclass+".png");
      this.tupuDataList = this.tupuDataList.filter(item => item.name !== point);
      
      if (Bool) {
        await axios.delete(`${this.$store.state.serverurl}/csvNode?name=${point}`)
          .then(response => {
            console.log(response.data);
            this.csvData=this.csvData+1
          })
          .catch(error => {
            console.error(error);
          });
      }else{
        alert("该点位不存在")
      }
    },
    async addLink() {
      const nodeFrom = this.nodeFrom
      const nodeTo = this.nodeTo
      const Bool1 = this.tupuDataList.some(item => item.name === nodeFrom);
      const Bool2 = this.tupuDataList.some(item => item.name === nodeTo);
      if (Bool1 && Bool2) {
        await axios.post(`${this.$store.state.serverurl}/csvLink?nodeFrom=${nodeFrom}&nodeTo=${nodeTo}`)
          .then(response => {
            console.log(response.data);
            this.csvData=this.csvData+1
          })
          .catch(error => { })
      }else{
        alert("请检查点位重新输入")
      }
    },
    async deleteLink() {
      const nodeFrom = this.nodeFrom
      const nodeTo = this.nodeTo
      const Bool1 = this.tupuDataList.some(item => item.name === nodeFrom);
      const Bool2 = this.tupuDataList.some(item => item.name === nodeTo);
      if (Bool1 && Bool2) {
        // this.csvLink = this.csvLink.filter(item => !(item.source === nodeFrom && item.target === nodeTo));
        await axios.delete(`${this.$store.state.serverurl}/csvLink?nodeFrom=${nodeFrom}&nodeTo=${nodeTo}`) 
        .then(response => {
          this.csvData=this.csvData+1
          })
          .catch(error => { })
      }else{
        alert("请检查点位重新输入")
      }
    },
    handleTupuSend(message) {
    this.tupuDataList = message;
      console.log('this.tupuDataList', this.tupuDataList);
     const temp = this.tupuDataList
    .filter(node => node.category === '1' || node.category === '4')
    .map(node => ({ value: node.name, label: node.name }));
    const temp1=this.tupuDataList
    .filter(node => node.category ==='1')
    .map(node => ({ value: node.name, label: node.name }));
    const temp2=this.tupuDataList
    .filter(node => node.category ==='4')
    .map(node => ({ value: node.name, label: node.name }));
    this.fly=temp1;
    this.Ground=temp2;
    let j=0;
      for(let i=0;i<this.fly.length;i++){
        this.radioLinkTupu.some(item => {

         if( this.fly[i].value === item){
          j++;
         }
        })
      }
      let k=0
      for(let i=0;i<this.Ground.length;i++){
        this.radioLinkTupu.some(item => {
          if(this.Ground[i].value === item){
            k++;
          }
        })
      }
      this.maxGroundNum=this.Ground.length-k
      this.maxFlyNum=this.fly.length-j
     this.optionsForTupu = temp;
     console.log("optionsForTupu", this.optionsForTupu);
},
    handleLinkList(linkList) {
      console.log('接收到的链接列表:', linkList);
      this.tupuLinkList = linkList;
    },
    handleChooseTupuItem(index, row) {
      console.log("selection", index)
      console.log("selection", this.radioLinkTupu)
    },
    showTupu() {
      this.isShowTupu = !this.isShowTupu;
    },

    async testnet() {
      var that = this;
      await axios
        .get(`${this.$store.state.serverurl}/testtcp2?`)
        .then((res) => {
          console.log(res);
          that.otherRadioIpGpsList = res.data;
        });
    },
    setRowSelected(row) {
      // 通过ref引用表格，并使用toggleRowSelection方法设置某行为选中状态
      for (var i = 0; i < this.radioPos.length; i++) {
        this.$refs.multipleTable.toggleRowSelection(this.radioPos[i], true);
      }
    },
    selectable1(row, index) {
      if (this.rectangleEntities.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    selectable2(row, index) {
      if (this.planRadio.length == 0) {
        return false;
      } else {
        return true;
      }
    },

    handleSelectionChange1(val) {
      if (this.rectangleEntities.length == 0) {
        return;
      }
      var selectedRows = val.map((row) => this.radioPos.indexOf(row));

      for (var i = 0; i < this.radioPos.length; i++) {
        if (selectedRows.indexOf(i) !== -1) {
          this.rectangleEntities[i].show = true;
        } else {
          this.rectangleEntities[i].show = false;
        }
        // this.rectangleEntities[selectedRows[i]].show = !this.rectangleEntities[i].show;
      }
    },
    handleSelectionChange2(val) {
      if (this.rectangleEntities.length == 0 || this.planRadio.length == 0) {
        return;
      }
      var selectedRows = val.map((row) => this.radioPos.indexOf(row));
      var lenOfAll = this.rectangleEntities.length;
      var lenOfPlan = this.planRadio.length;
      for (var i = lenOfAll - lenOfPlan; i < lenOfAll; i++) {
        let rowIdx = i - (lenOfAll - lenOfPlan);
        if (selectedRows.indexOf(rowIdx) !== -1) {
          this.rectangleEntities[i].show = true;
        } else {
          this.rectangleEntities[i].show = false;
        }
        // this.rectangleEntities[selectedRows[i]].show = !this.rectangleEntities[i].show;
      }
    },

    continueUpload() {
      if (this.isRunning || this.isAnalying) {
        alert('后台还在计算，请稍后');
        return;
      }
      console.log('重新开始态势更新');
      this.planRadio = [];
      this.lines = [];
      this.rectangles = [];
      this.ReloadAllMarkers();
      this.isAnalying = false;
      this.isRunning = false;
      this.selectAndUpload();
    },

    //https://192.168.5.100:7715/api/v1/ext/DevTree?token=f9b052102e84d5f47beb72232cb87fa1ab353e263f2939145abf05b96e3c36c616dfc7dcb823b0f359f4a11140ecfb033b682ac4ad75a377b224237bfe177d51d046875a16dfb756bd0c93cd2ead6094
    //https://192.168.5.100:7715/api/v1/ext/DevList?enterId=20000000&groupId=30000000
    getDevList() {
      var that = this;
      if (this.sdkclient.mConnected) {
        this.msctoken = this.sdkclient.token;
        axios
          .get(
            `${this.gatewayUrl.replace(
              'gateway',
              ''
            )}/api/v1/ext/DevTree?token=${this.msctoken}`
          )
          .then((res) => {
            var specificSubstring = '132';
            const regex = new RegExp(`^.{10}${specificSubstring}.{7}$`);
            if (res.status == 0 || res.status == 200) {
              var content = res.data.content;
              for (const item of content) {
                var data = item.data;
                if ('deviceId' in data) {
                  //是设备
                  var str = data['deviceId'];
                  if (str.length == 20 && regex.test(str))
                    //并且是电台设备
                    that.devNameDict[str] = data['deviceName'];
                }
              }
            }
          });
      }
    },
    changeLayer() {
      if (!this.isStreetLayer) {
        this.isStreetLayer = true;
        this.nanningStreetLayer =
          this.viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              url: 'http://192.168.10.167:8082/data/imagetiles/nanningstreet/{z}/{x}/{y}.png',
              // url: 'http://192.168.10.167:8080/imagetiles/nanningstreet/{z}/{x}/{y}.png',

              transparent: true,
              color: Cesium.Color.WHITE.withAlpha(0.2)
            })
          );
        this.guilinStreetLayer =
          this.viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              // url: 'http://192.168.10.167:8080/imagetiles/guilinstreet/{z}/{x}/{y}.png',
              url: 'http://192.168.10.167:8082/data/imagetiles/guilinstreet/{z}/{x}/{y}.png',
              transparent: true,
              color: Cesium.Color.WHITE.withAlpha(0.2)
            })
          );
        this.wuhanStreetLayer =
          this.viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              // url: 'http://192.168.10.167:8080/imagetiles/wuhanstreet/{z}/{x}/{y}.png',
              url: 'http://192.168.10.167:8082/data/imagetiles/wuhanstreet/{z}/{x}/{y}.png',
              transparent: true,
              color: Cesium.Color.WHITE.withAlpha(0.2)
            })
          );
      } else {
        this.isStreetLayer = false;
        this.viewer.scene.imageryLayers.remove(this.wuhanStreetLayer);
        this.viewer.scene.imageryLayers.remove(this.nanningStreetLayer);
        this.viewer.scene.imageryLayers.remove(this.guilinStreetLayer);
      }
    },
    SaveImg() {
      if (!this.resultImgName) {
        this.$message({
          showClose: true,
          message: '未获得任何结果',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      var url = this.resultImgName;
      let a = document.createElement('a'); // 生成一个a元素
      let event = new MouseEvent('click'); // 创建一个单击事件
      a.download = 'result'; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    },
    toGeoJSON() {
      if (this.radioPosLength == 0) {
        this.$message({
          showClose: true,
          message: '未选择点位',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      var tmp_json = {
        type: 'FeatureCollection',
        features: []
      };
      for (let i = 0; i < this.radioPos.length; i++) {
        var tmp_fea = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              this.radioPos[i].lon,
              this.radioPos[i].lat,
              this.radioPos[i].height
            ]
          },
          properties: {
            name: i
          }
        };
        tmp_json.features.push(tmp_fea);
      }

      let eleLink = document.createElement('a');
      eleLink.download = 'radioPoint.geojson';
      eleLink.style.display = 'none';

      // 这里的data换成你想要导出的JavaScript对象
      let data = tmp_json;

      let blob = new Blob([JSON.stringify(data, undefined, 4)], {
        type: 'text/geojson'
      });
      eleLink.href = URL.createObjectURL(blob);
      document.body.appendChild(eleLink);
      eleLink.click();

      document.body.removeChild(eleLink);
    },
    ChooseFile(event) {
      console.log('1');
      var that = this;
      let file = event.target.files[0];
      console.log('选择完成');
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (e) {
        var content = e.target.result;

        var json_data = JSON.parse(content);
        console.log(json_data);
        var tmp_radioPosList = json_data.features;
        that.radioPosLength = tmp_radioPosList.length;
        for (let i = 0; i < that.radioPosLength; i++) {
          var tmp_coord = tmp_radioPosList[i].geometry.coordinates;
          let tmp_Point = {
            lon: tmp_coord[0],
            lat: tmp_coord[1],
            height: tmp_coord[2]
          };
          that.radioPos.push(tmp_Point);
          that.ReloadAllMarkers();
        }
      };
    },
    importGeoJSON(event) {
      // if (!this.inviteCode) {
      // 	this.$message({
      // 		showClose: true,
      // 		message: '还未选择项目',
      // 		type: 'warning',
      // 		duration: 3000
      // 	});
      // 	return
      // }
      this.$refs.uploadGeoJSON.dispatchEvent(new MouseEvent('click'));
    },

    handleCheck(index, row) {
      this.viewer.camera.flyTo({
        destination: this.Cesium.Cartesian3.fromDegrees(
          Number(row.lon),
          Number(row.lat),
          50
        ),
        duration: 1.5
      });
    },
    handleDelete(index, row) {
      this.radioPos.splice(index, 1);
     
      this.radioPosLength = this.radioPosLength - 1; 
      this.radioLinkTupu.splice(index, 1);
      this.ReloadAllMarkers();
    },
    headUpload(params) {
      let param = new FormData();
      param.append('files', params.file);
    },
    remove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    uploadChange(file, fileList) {
      this.headFile = file;
      this.hideUpload = fileList.length >= this.limitCount;
      this.para = file.raw;
    },
    handlePreview(file) {
      this.previewPath = file.url;
      this.previewVisible = true;
    },

    fileExceed() {
      this.$message({
        showClose: true,
        message: '目前仅支持上传一张图片',
        type: 'warning',
        duration: 3000
      });
    },

    StartSign() {
      if (this.signBtnName == '选择电台点位') {
        this.signMode = true;
      } else {
        this.signMode = false;
      }
    },
    StartSign1() {
      if (this.signName == '开始选择点(不可聚类)') {
        this.sign = true;
      } else {
        this.sign = false;
      }
    },
    Resize() {
      this.viewer.camera.flyTo({
        destination: this.Cesium.Cartesian3.fromDegrees(
          Number(110.314539),
          Number(25.329736),
          50
        ),
        duration: 1
      });
    },
    HideImg() {
      //图标切换
      if (self.hideIconUrl != './view.png') {
        self.hideIconUrl = './uav1.png';
      } else {
        self.hideIconUrl = './hide.png';
      }

      var size = this.rectangleEntities.length;
      var isAnyShow = false;
      //检查是否有图片是在显示状态
      for (var i = 0; i < size; i++) {
        if (this.rectangleEntities[i].show == true) {
          isAnyShow = true;
          break;
        }
      }
      //如果是则全为false，否则就全是设为true
      for (var i = 0; i < size; i++) {
        this.rectangleEntities[i].show = !isAnyShow;
      }
    },

    //添加标记点
    //绘制点
    AddSignPoint(longitudeString, latitudeString, height, type, label) {
      var pointPostion = new Cesium.Cartesian3.fromDegrees(
        longitudeString,
        latitudeString,
        height
      );
      var imageurl = height >= 250 ? './uav1.png' : './电台W.png';
      //如果指定了图标，则优先指定的类型
      if (type == '地面') {
        imageurl = './电台W.png';
      }
      if (type == '空中') {
        imageurl = './uav1.png';
      }
      if (type == 'marker') {
        imageurl = './位置.png';
      }
      let x = this.viewer.entities.add({
        name: 'radio',
        longitude: longitudeString,
        latitude: latitudeString,
        height: height,
        position: pointPostion,
        label: {
          text: label,
          font: '16px sans-serif', // 字体样式
          fillColor: Cesium.Color.YELLOW, // 文本填充颜色
          outlineColor: Cesium.Color.BLACK, // 文本轮廓颜色
          outlineWidth: 2, // 文本轮廓宽度
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 文本样式
          pixelOffset: new Cesium.Cartesian2(0, 0) // 文本位置偏移
        },
        billboard: {
          image: imageurl,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scale: 1
        }
      });
      this.radioEntities.push(x);
    },

    ReloadAllMarkers() {
      console.log('line', this.lineEntities);
      console.log('line all', this.viewer.entities);
      for (let i = 0; i < this.radioEntities.length; i++) {
        this.viewer.entities.remove(this.radioEntities[i]);
      }
      for (let i = 0; i < this.lineEntities.length; i++) {
        this.viewer.entities.remove(this.lineEntities[i]);
      }
      for (let i = 0; i < this.rectangleEntities.length; i++) {
        this.viewer.entities.remove(this.rectangleEntities[i]);
      }
      console.log('line array', this.lines);

      this.viewer.entities.removeAll();
      this.radioEntities = [];
      this.lineEntities = [];
      this.rectangleEntities = [];
      for (let i = 0; i < this.radioPos.length; i++) {
        this.AddSignPoint(
          Number(this.radioPos[i].lon),
          Number(this.radioPos[i].lat),
          Number(this.radioPos[i].height),
          'marker',
          this.devOnlineListName[i]
        );
      }
      for (let i = 0; i < this.planRadio.length; i++) {
        this.AddSignPoint(
          Number(this.planRadio[i].lon),
          Number(this.planRadio[i].lat),
          Number(this.planRadio[i].height),
          this.planRadio[i].prtype,
          '补点'
        );
      }
      for (var i = 0; i < this.lines.length; i++) {
        var positions = Cesium.Cartesian3.fromDegreesArrayHeights(
          this.lines[i]
        );
        var tpolyline = new Cesium.PolylineGraphics({
          positions: positions,
          width: 2,
          material: Cesium.Color.RED
        });
        this.lineEntities.push(
          this.viewer.entities.add({
            polyline: tpolyline
          })
        );
      }
      for (let i = 0; i < this.rectangles.length; i++) {
        var rectCoor = this.rectangles[i];
        let x = this.viewer.entities.add({
          name: 'wuhan30',
          rectangle: {
            coordinates: new Cesium.Rectangle.fromDegrees(
              rectCoor[0],
              rectCoor[1],
              rectCoor[2],
              rectCoor[3]
            ),
            material: new Cesium.ImageMaterialProperty({
              image:
                '${this.$store.state.serverurl}/resultimages/result_img' + i + '.png', // 替换为你自己的图片路径
              color: Cesium.Color.WHITE.withAlpha(0.6), //0.2
              transparent: true
            })
          }
        });
        this.rectangleEntities.push(x);
      }
    },

    uploadRadioPos() {
      console.log('进入了uploadRadioPos，回调函数成功');
      if (this.isRunning) {
        console.log('后台还在处理，请等待');
        return;
      }
      if (this.radioPos.length == 0) {
        // this.$message({
        // 	showClose: true,
        // 	message: '没有在线设备',
        // 	type: 'warning',
        // 	duration: 3000
        // });
        console.log('没有在线设备');
        return;
      }
      this.setRowSelected();
      this.isRunning = true;
      var that = this;
      // that.imgLoading = true
      let send = {
        radioPos: this.radioPos,
        tifname: this.tifname,
        samplePointInterval: this.samplePointInterval,
        maxComputeRadioDistance: this.maxComputeRadioDistance
      };
      that.$store.state.upLoadProgress = 0;
      const jsonString = JSON.stringify(send);
      axios
        .post(`${this.$store.state.serverurl}/uploadRadioPos?`, {
          data: jsonString
        })
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success',
              duration: 3000
            });
            // that.imgLoading = false
            that.isRunning = false;
            that.resultImgName = res.data.url;
            that.rectangles = res.data.rectangles;
            that.updateResultImgAndMarkers();
          } else {
            this.$message({
              showClose: true,
              message: '服务器错误,请稍后',
              type: 'error',
              duration: 3000
            });
            // this.imgLoading = false
          }
        });
    },

    getDevicesGpsFromOnlineClients() {
      //1.获取所有在线的设备信息
      console.log('getDevicesGpsFromOnlineClients: begin!');
      console.log('getDevicesGpsFromOnlineClients: ', this.devOnlineList);

      this.devOnlineList.forEach(function (element) {
        this.mClient
          .requestMsg2GatewayServer('getGps', { devId: element })
          .then((resp) => {
            let tpos = {
              lon: parseFloat(resp.lng),
              lat: parseFloat(resp.lat),
              height: 15
            };
            this.radioPos.push(tpos);
            console.log('getDevicesGpsFromOnlineClients: ', element, '+', tpos);
          });
      });
    },

    updateResultImgAndMarkers() {
      this.ReloadAllMarkers();
      this.viewer.scene.render();
    },

    getDeviceOnlineList() {
      var that = this;
      if (this.sdkclient.mConnected) {
        this.sdkclient
          .requestMsg2GatewayServer('getDevOnlineList', {})
          .then((res) => {
            const prefix = '3402000000132';
            // 创建正则表达式，其中^表示字符串开始，{n}表示前n位精确匹配
            const regex = new RegExp('^' + prefix.replace(/ /g, '\\s') + '.*');
            var data = res.Content;
            var dict = {};
            data.forEach((item) => {
              if (item.userType == 11 && regex.test(item.DevId)) {
                dict[item.DevId] = {};
              }
            });
            that.devOnlineList = data;
            that.deviceOnlineGpsList = dict;
          });
      }
      setTimeout(this.getDeviceOnlineList, 10000);
    },

    updateGps() {
      var that = this;
      this.devOnlineList.forEach((item) => {
        if (item.userType == 1) {
          var tid = item.DevId;
          this.sdkclient
            .requestMsg2GatewayServer('getGps', { devId: tid })
            .then((resp) => {
              if (!isNaN(parseFloat(resp.lng))) {
                var lng = parseFloat(resp.lng);
                var lat = parseFloat(resp.lat);
                var cartographic = that.Cesium.Cartographic.fromDegrees(
                  lng,
                  lat
                );
                console.log('cartographic', cartographic);
                var height = 190;
                height = that.viewer.scene.globe.getHeight(cartographic);
                console.log('cartographic', cartographic.height);
                if (height == null || height < 30) {
                  height = 190;
                }
                var tpos = { lon: lng, lat: lat, height: height };
                that.deviceOnlineGpsList[tid] = tpos;
              }
            });
        }
      });
    },

    selectAndUpload() {
      if (this.isAnalying) {
        return;
      }
      var tempPos = [];
      var tempName = [];
      var tempPosDad = this.deviceOnlineGpsList;
      for (let key in tempPosDad) {
        var tpos = tempPosDad[key];
        if (
          (tpos != null) &
          (Object.keys(tpos).length !== 0) &
          (tpos.lat !== 0) &
          (tpos.lng !== 0)
        ) {
          tempName.push(this.devNameDict[key]);
          tempPos.push(tpos);
        }
      }
      //0620新需求，添加另一种方式获得电台坐标的数据
      this.testnet();

      for (let key in this.otherRadioIpGpsList) {
        tempName.push(key);
        tempPos.push(this.otherRadioIpGpsList[key]);
      }

      this.radioPos = tempPos;
      this.devOnlineListName = tempName;
      this.uploadRadioPos();

      setTimeout(this.selectAndUpload, 20000);
    },

    printDevOnlineList() {
      console.log("selection", this.radioLinkTupu);
      // console.log('dev print3 deviceOnlineGpsList', this.deviceOnlineGpsList);
      // console.log('dev print3 devOnlineListName', this.devOnlineListName);
      // console.log('dev print3 radiopos', this.radiopos);
      // console.log('dev print3 other', this.otherRadioIpGpsList);

      setTimeout(this.printDevOnlineList, 5000);
    },

    stopSensing() {
      this.timer = null;
    },

    addRow() {
      this.tableData.push({ name: '', age: '' });
    },
    removeRow(index) {
      this.tableData.splice(index, 1);
    },

    handlePrtypeChange(value) {
      this.chosenPrType = this.prtypeOptions[value - 1]['title'];
      console.log(value);
    },
    submitPrRadioInfo() {
      let prinfo = {
        prtype: this.chosenPrType,
        height: this.prHeightNum
      };
      this.planRadio.push(prinfo);
      console.log(prinfo);
    },
    handleDelPrinfo(index, row) {
      this.planRadio.splice(index, 1);
      
    },
    analysePlanRadio() {
      // if (this.planRadio.length != 1){
      // 	console.log('只支持一个计划点位')
      // 	return
      // }
      //上传数据：四个指标
      if (this.isRunning) {
        console.log('后台正在处理');
        return;
      }
      this.isAnalying = true;
      this.isRunning = true;
      let sendData = {
        radioPos: this.radioPos,
        maxGroundHeight: this.maxGroundHeight,
        maxGroundNum: this.maxGroundNum,
        maxFlyHeight: this.maxFlyHeight,
        maxFlyNum: this.maxFlyNum,
        tifname: this.tifname,
        samplePointInterval: this.samplePointInterval,
        maxComputeRadioDistance: this.maxComputeRadioDistance
      };
      var that = this;
      sendData = JSON.stringify(sendData);
      axios
        .post(`${this.$store.state.serverurl}/analysePlanRadio?`, {
          data: sendData
        })
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success',
              duration: 3000
            });
            //不满足时弹窗提示不满足
            if (res.data.find == 0) {
              alert('不满足，请添加最大可用点');
              that.isAnalying = false;
              that.isRunning = false;
              // that.selectAndUpload()
              return;
            }
            //更新图片
            that.isRunning = false;
            that.resultImgName = res.data.url;
            //表格显示结果
            that.planRadio = res.data.plan;
            //绘制通信线
            that.lines = res.data.lines;
            that.rectangles = res.data.rectangles;
            that.updateResultImgAndMarkers();
            that.isAnalying = false;
          } else {
            that.isRunning = false;
            that.isAnalying = false;
            this.$message({
              showClose: true,
              message: '服务器错误,请稍后',
              type: 'error',
              duration: 3000
            });
          }
        });
    },

    init() {
      //Cesium.Ion.defaultAccessToken =
      //	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTA1MWU5Ny1jZTk5LTRlMWYtYWQxMi05OGJmNGUyYmZlMDgiLCJpZCI6NjMyMTEsImlhdCI6MTYyNzk1NTY0MX0.r5WqT4nO5JbOyrA415W7Zbk139BbqxBtpgeNZ2slM1g'

      var that = this;
      //查看器

      var viewer = new Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false, //是否显示帮助信息控件
        fullscreenButton: false, //全屏显示
        CreditsDisplay: false,
        timeline: false,
        homeButton: false, // home按钮
        navigationHelpButton: false,
        shouldAnimate: false,
        animation: false,
        orderIndependentTranslucency: true,
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
          url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        })
      });

      //添加3dtiles
      let tileset = new Cesium.Cesium3DTileset({
        // url: 'http://192.168.10.167:8080/data/3DTiles/guangxiguilin/tileset.json',
        url: 'http://192.168.10.167:8082/data/3DTiles/gx/tileset.json',
        // url: 'http://192.168.10.167:9003/model/toCSgzpO1/tileset.json',
        // url: this.$config.tilesurl1,
        //【重要】数值加大，能让最终成像变模糊
        // ScreenSpaceErrorFactor: 16,
        // skipLevels: 1,
        // immediatelyLoadDesiredLevelOfDetail: false,
        // cullWithChildrenBounds: true,
        // skipLevelOfDetail: true, //开启跳级加载
        // loadSiblings: true,
        // maximumScreenSpaceError: 32,
        // //这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，
        // //这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，
        // //此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
        // preferLeaves: true,
        // //【重要】内存建议显存大小的50%左右，内存分配变小有利于倾斜摄影数据回收，提升性能体验
        // maximumMemoryUsage: 4128,
        // skipScreenSpaceErrorFactor: 8,
        //控制切片视角显示的数量，可调整性能
        // maximumScreenSpaceError: 2,//最大的屏幕空间误差
        // maximumNumberOfLoadedTiles: 100000, //最大加载瓦片个数

        //xhk参数
        baseScreenSpaceError: 4096,
        skipScreenspaceErrorFactor: 8,
        skipLevels: 1,
        immediatelyLoadDesiredLevelofDetail: false,
        loadSiblings: false,
        cullWithChildrenBounds: true,
        skipLevelofDetail: true, //开启跳级加载
        preferLeaves: true,
        maximumMemoryUsage: 512
      });
      viewer.scene.primitives.show = false;
      viewer.scene.primitives.add(tileset);
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(110.1948, 25.28473, 300),
        duration: 1.5
      });

      //添加在线dsm。
      // viewer.terrainProvider=Cesium.createWorldTerrain();
      //添加卫星影像切片
      viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          // url: 'http://192.168.10.167:8080/imagetiles/guilin1/{z}/{x}/{y}.png',
          url: 'http://192.168.10.167:8082/data/imagetiles/guilin1/{z}/{x}/{y}.png',
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(0.2)
        })
      );
      viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          // url: 'http://192.168.10.167:8080/imagetiles/guilin2/{z}/{x}/{y}.png',
          url: 'http://192.168.10.167:8082/data/imagetiles/guilin2/{z}/{x}/{y}.png',
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(0.2)
        })
      );
      viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          // url: 'http://192.168.10.167:8080/imagetiles/nanning/{z}/{x}/{y}.png',
          url: 'http://192.168.10.167:8082/data/imagetiles/nanning/{z}/{x}/{y}.png',
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(0.2)
        })
      );
      viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          // url: 'http://192.168.10.167:8080/imagetiles/wuhan/{z}/{x}/{y}.png',
          url: 'http://192.168.10.167:8082/data/imagetiles/wuhan/{z}/{x}/{y}.png',
          transparent: true,
          color: Cesium.Color.WHITE.withAlpha(0.2)
        })
      );

      //双击鼠标左键清除默认事件
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权

      viewer.scene.globe.depthTestAgainstTerrain = true;

      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (evt) {
        //优先判断是否拾取到3dtiles模型
        let pickedObject = viewer.scene.pick(evt.position);
        // 判断是否拾取到模型
        if (
          viewer.scene.pickPositionSupported &&
          Cesium.defined(pickedObject)
        ) {
          var cartesian = viewer.scene.pickPosition(evt.position);
          // 是否获取到空间坐标
          if (Cesium.defined(cartesian)) {
            // // 空间坐标转世界坐标(弧度)
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          }
        } else {
          //没有3dtiles模型则返回一个地形高度
          // 返回一个ray和地球表面的一个交点的Cartesian3坐标。
          let ray = viewer.camera.getPickRay(evt.position);
          cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          // // 空间坐标转世界坐标(弧度)
          cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        }
        // 弧度转为角度（经纬度）
        let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6); //经度值
        let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6); //纬度值
        // 地形高度(下面两个二选一就行)
        let height = cartographic.height.toFixed(2);
        let height2 = viewer.scene.globe.getHeight(cartographic);
        console.log(lon, lat, height, height2, 'from 3dtiles');
        if (that.signMode) {
          let tmp_Point = {
            lon: lon,
            lat: lat,
            height: height
          };
          that.radioPos.push(tmp_Point);
          that.radioPosLength = that.radioPosLength + 1;
          that.ReloadAllMarkers();
        }else if(that.sign){
          let tmp_Point = {
            lon: lon,
            lat: lat,
            height: height
          };
          that.radioPos.push(tmp_Point);
          that.radioPosLength = that.radioPosLength + 1;
          that.ReloadAllMarkers();
          // that.radioPosLength = that.radioPosLength + 1;
          // that.ReloadAllMarkers();
        }

        // if(that.sign){
        //   let tmp_Point = {
        //     lon: lon,
        //     lat: lat,
        //     height: height
        //   };
        //   that.radioPos.push(tmp_Point);
        //   that.radioPosLength = that.radioPosLength + 1;
        //   that.ReloadAllMarkers();
        // }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      that.viewer = viewer;
      that.Cesium = Cesium;
    }
  },
  async mounted() {
    // await this.fetchDataFromServer();
    this.init();
    // //链接网关
    // this.sdkclient = new SdkDemo();
    // this.sdkclient.connect(this.gatewayUrl, this.username, this.password, null, null)

    //获取设备名字
    setTimeout(this.getDevList, 500);
    //获取在线设备列表
    setTimeout(this.getDeviceOnlineList, 1000);


    // //添加监听器
    // this.sdkclient.addObserver('gpsUpload', msg => {
    // 	if (msg.method == 'gpsUpload') {
    // 		var data = msg.data;
    // 		var id = data.devId;
    // 		if (id in this.devNameDict) {
    // 			if (!isNaN(parseFloat(data.lng))) {
    // 				var lng = parseFloat(data.lng)
    // 				var lat = parseFloat(data.lat)
    // 				if(lat == 0 || lng ==0){
    // 					return;
    // 				}
    // 				var cartographic = this.Cesium.Cartographic.fromDegrees(lng, lat);
    // 				var height = 190;
    // 				height = this.viewer.scene.globe.getHeight(cartographic).toFixed(2)
    // 				console.log("height", height)
    // 				if (height == null || height < 30) {
    // 					height = 190;
    // 				}
    // 				var tpos = { lon: lng, lat: lat, height: height };
    // 				this.deviceOnlineGpsList[id] = tpos;
    // 			}
    // 		}
    // 	}
    // })
    // // //开启动态更新坐标函数
    //this.printDevOnlineList();
    // // 开启动态上传坐标进行态势感知函数
    // this.selectAndUpload();
  },

  destroyed() { }
};
</script>

<style scoped>
.text-span {
  min-width: 80px;
  display: inline-block;
  line-height: 28px;
}

.text-min {
  text-align: left;
  min-width: 50%;
}
#cesiumContainer {
  height: calc(100vh - 59px);
}

.cesiumbox {
  margin-left: 25%;
  height: calc(100vh - 59px);
  z-index: 0;
  width: 75%;
  position: absolute;
}

.operationTable {
  overflow-y: auto;
  overflow-x:auto ;
  background-color: #19284b;
  border: 1px solid;
  box-sizing: border-box;
  border-color: #969696;
  width: 25%;
  height: calc(100vh - 59px);
  left: 0px;
  position: absolute;
  color: aliceblue;
  /* overflow: hidden; */
  display: inline-block;
  /* margin-left: 6px; */
}
.hide .el-upload--picture-card {
  display: none;
}

.Hide,
.Resize,
.Change {
  position: fixed;
  right: 20px;
  z-index: 1;
  opacity: 0.7;
  cursor: pointer;
  border: none;
  padding: 0;
  background-size: cover;
  background-position: center;
}

.Hide {
  bottom: 80px;
  height: 40px;
  width: 45px;
}

.Resize {
  bottom: 30px;
  height: 40px;
  background-color: rgb(123, 195, 7);
  border-color: gray;
  width: 45px;
}

.Change {
  bottom: 130px;
  height: 40px;
  width: 45px;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 114514;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
