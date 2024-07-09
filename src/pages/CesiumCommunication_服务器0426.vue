<template>
	<div id="">
		<div class="modal" v-show="imgLoading"
			style="background-color: rgba(0, 0, 0, 0.5);z-index: 502;width: 100%;height: 100%;position: absolute;">
			<span style="position: absolute;width: 20%;margin-top:20% ;color: #409eff;">
				等待中...
			</span>
			<el-progress :percentage="$store.state.upLoadProgress" style="width: 30%;margin-left:35% ;margin-top:22% ;">
			</el-progress>

		</div>
		<!-- <input v-show=false ref="uploadGeoJSON" type="file" style="margin-top: 10px;" name="file" id="file"
			accept=".geojson" @change="ChooseFile($event)">
		<el-button v-show="handImport" style="position: absolute;left:120px ;top: 400px;z-index: 2200;" type="primary"
			size="mini" @click.prevent="importGeoJSON" link>手动导入GeoJSON文件
		</el-button> -->
		<!-- <el-button v-show="handImport" style="position: absolute;left:120px ;top: 500px;z-index: 2200;" type="primary"
			size="mini" @click.prevent="nomain" link>获取设备实时点位
		</el-button> -->

		<div class="operationTable" style="box-shadow: 2px 2px 2px 2PX #d6d6d6;background-color: #fcfcfc;">

			<div
				style=" color: #565656;text-align:center; font-size: 23px; font-weight: bold;margin-top: 10px;margin-bottom: 15px;">
				项目面板
			</div>
			<div class="panel">
				<label style="margin-left: 12px;font-size: 13px;">选择区域</label>
				<el-select placeholder="请选择一个区域" filterable v-model="inviteCode"
					style="margin-top: 10px;margin-left: 5px;width:270px;margin-bottom: 15px;" size="mini">
					<el-option v-for="item in projectOptions" :key="item.projectInviteCode" :label="item.title"
						:value="item.projectInviteCode">
					</el-option>
				</el-select>
				<hr>
				<label style="color:#4d4d4d;font-size: 15px;font-weight: bold;">已选电台点位</label>

				<el-table class="fileTable" :data="radioPos" empty-text=" "
					style=" width: 98%;height:300px;max-height: 300px;margin-top: 10px;" row-key="id" default-expand-all
					stripe size="mini">

					<el-table-column label="X" width="97" align="center" prop="lon">
					</el-table-column>
					<el-table-column label="Y" width="97" align="center" prop="lat">
					</el-table-column>
					<el-table-column label="Z" width="60" align="center" prop="height">
					</el-table-column>

					<el-table-column align="right" label="操作" width="60">

						<template #default="scope">
							<el-button size="mini" @click.prevent="handleCheck(scope.$index, scope.row)" link>查看
							</el-button>
						</template>

					</el-table-column>
					<el-table-column>

						<template #default="scope">
							<el-button size="mini" @click.prevent="handleDelete(scope.$index, scope.row)" link
								style="color: red;">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <div style="display: flex;">
					<el-button size="small" style="float: left;margin-top: 10px;margin-left: 4%;color:#00aaff"
						@click="connectTo3pc">
						获取通信态势
					</el-button>
				</div> -->
				<div style="display: flex;">
					<el-button size="small" style="width: 90px;margin-top: 10px;margin-left: 4%;color:#00aaff"
						@click="StartSign">
						{{ signBtnName }}
					</el-button>
					<el-button size="small" style="float: left;margin-top: 10px;margin-left: 4%;color:#00aaff"
						@click="toGeoJSON">
						导出坐标点
					</el-button>
					<el-button size="small" style="float: left;margin-top: 10px;margin-left: 4%;color:#00aaff"
						@click="uploadRadioPos">
						上传
					</el-button>
					<el-button size="small" style="float: left;margin-top: 10px;margin-left: 4%;color:#00aaff"
						@click="SaveImg">
						保存结果
					</el-button>
				</div>
			</div>
			<hr>
			<div>
				<!-- <label style="font-size: 10px">
					最大可用地面点数量：{{ this.useableGroundRadioNum }}
					最大可用空中点数量：{{ this.useableAirRadioNum }}
				</label> -->
				<div style="font-size: 7px; float:left">
					最大可用地面点数量：<el-input-number v-model="maxGroundNum" :precision="0" :max="200" size="small"
						:controls="false" style="width:50px" />
					地面最大允许架高值：<el-input-number v-model="maxGroundHeight" :precision="2" :max="200" size="small"
						:controls="false" style="width:70px;" />

				</div>
				<div style="font-size: 9px; float:left">
					最大可用空中点数量：<el-input-number v-model="maxFlyNum" :precision="0" :max="200" size="small"
						:controls="false" style="width:50px" />
					空中节点最大飞行高度 ：<el-input-number v-model="maxFlyHeight" :precision="2" :max="500" size="small"
						:controls="false" style="width:70px" />
				</div>
				<br>
				<!-- <label style="font-size: 10px">
					地面节点最大允许架高值：{{ this.maxGroundHeight }}
					空中节点最大飞行高度：{{ this.maxFlyHeight }}
				</label> -->

			</div>
			<!-- <label style="color:#4d4d4d;font-size: 15px;font-weight: bold;">计划派出电台</label>
			<br>

			<el-select v-model="chosenPrType" placeholder="选择类型" @change="handlePrtypeChange" style="width:100px">
				<el-option v-for="item in prtypeOptions" :key="item.prtypeIndex" :label="item.title" :value="item.prtypeIndex"/>
			</el-select>
			<el-input-number v-model="prHeightNum" :precision="2" :step="0.1" :max="200" />
			<el-button @click="submitPrRadioInfo">submit</el-button> -->

			<el-button style="float: left;" @click="analysePlanRadio">补点分析</el-button>

			<el-table :data="planRadio" empty-text=" "
				style=" width: 98%; height: 300px; max-height: 300px; margin-top: 10px; overflow-y: auto; font-size: small;"
				row-key="index" default-expand-all stripe size="mini">
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
				<el-table-column>
					<template #default="scope">
						<el-button size="mini" @click.prevent="handleDelPrinfo(scope.$index, scope.row)" link
							style="color: red;">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>


		</div>



		<div id="container" class="cesiumbox" style="">
			<div id="cesiumContainer" :style="cesiumStyle">
				<el-button class="Change" type="primary" size="mini" @click="changeLayer" :style="{ backgroundImage: 'url(' + changeIconUrl + ')' }">
				</el-button>
				<el-button class="Hide" type="primary" size="mini" @click="HideImg" :style="{ backgroundImage: 'url(' + hideIconUrl + ')' }">
				</el-button>
				<el-button class="Resize" type="primary" size="mini" @click="Resize">
					<el-icon>
						<Refresh />
					</el-icon>
				</el-button>

				<span style="position: absolute;right: 20px;bottom: 5px;z-index: 1;color: #ffffff;">{{ currentMousePos1
					}},{{ currentMousePos2 }}</span>
			</div>


		</div>
	</div>
</template>
<script>
import axios from 'axios'
import service from '@/userinfo/request';
import destroy from 'readable-stream/lib/internal/streams/destroy';
import { mcs8Client } from '@/sdk/mcs8Client.js';
import SdkDemo from '@/sdk/sdkDemo.js'



export default {
	components: {
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
			hideIconUrl: './hide.png',
			changeIconUrl: './street.png',
			isStreetLayer: false,
			guilinStreetLayer: null,
			nanningStreetLayer: null,
			wuhanStreetLayer: null,
			isAnalying: false,
			rectangles: [],
			rectangleEntities: [],
			isRunning: false,
			tifname: "guangxi_guilin",
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

			viewer: null,
			Cesium: null,
			projectOptions: [{
				projectInviteCode: 1,
				title: "广西桂林",
			}, {
				projectInviteCode: 2,
				title: "广西南宁",
			}, {
				projectInviteCode: 3,
				title: "湖北武汉",
			}],
			inviteCode: '',
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
			search: "",
			rsImgEntity: null,
			radioEntities: [],
			imgLoading: false,
			upLoadProgress: 20,
			intervalBox: null,
			xxxb_tileset: null,
			wlxb_tileset: null,
			primitiveManager: null,
			entityResult: null,
			resultImgName: "",

			//liubocai

			gatewayUrl: 'https://192.168.5.100:7715',
			username: "1101",
			password: '000000',
			mClient: null,
			sdkclient: null,
			mConnected: false,
			devNameDict: {
				"34020000001320000201": "单兵01",
				"34020000001320000202": "单兵02",
				"34020000001320000203": "单兵03",
				"34020000001320000204": "单兵04",
				"34020000001320000205": "单兵05",
				"34020000001320000206": "单兵06",
				"34020000001320000207": "单兵07",
				"34020000001320000208": "单兵08",
				"34020000001320000209": "单兵09",
			},
			devOnlineListName: [],
			devOnlineList: [],
			deviceOnlineGpsList: {
			},
			nowradioPosIndex: -1,
			timer: null,
			//新需求，能够设定要添加的电台数量和高度
			tableData: [
				{ name: '', age: '' },
			],
			form:
				{ id: 'qwe', name: 'qwe', type: '地面', height: 'eqw' }
			,

			useableGroundRadioNum: 1,
			useableAirRadioNum: 1,
			maxGroundHeight: 15,
			maxFlyHeight: 100,
			maxGroundNum: 0,
			maxFlyNum: 0,
			planRadio: [
				// {prtype:"地面", height:"114.1", lon:"114.123456", lat:"30.123456"},
			],
			chosenPrType: "",
			prtypeOptions: [
				{ prtypeIndex: 1, title: "地面" },
				{ prtypeIndex: 2, title: "空中" },
			],
			prHeightNum: 0,
			lineEntities: [],
			lines: [],
			radioposUpload: [],
		}
	},
	watch: {
		resultImgName(newValue) {

			// this.entityResult.rectangle.material = newValue;
			// this.entityResult.rectangle.material.image = newValue;
			// console.log("监听到变化了！!!!!");
			// this.ReloadAllMarkers();
			// this.viewer.scene.requestRender();

		},
		inviteCode(newValue) {
			if (newValue == 1) {
				this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
					url: "http://localhost:8082/data/terraintiles/guangxi_guilin_dsmtiles/",
					// url: "http://localhost:9003/terrain/jRVxAu1Z/",
					requestVertexNormals: true
				})
				this.tifname = "guangxi_guilin";
				this.viewer.camera.flyTo({
					destination: this.Cesium.Cartesian3.fromDegrees(110.43, 25.31, 200),
					duration: 1.5
				})
			} else if (newValue == 2) {
				this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
					url: "http://localhost:8082/data/terraintiles/guangxi_nanning_dsmtiles/",
					// url: "http://localhost:9003/terrain/P7l7gB2a/",
					requestVertexNormals: true
				})
				this.tifname = "guangxi_nanning";
				this.viewer.camera.flyTo({
					destination: this.Cesium.Cartesian3.fromDegrees(108.33, 22.80, 200),
					duration: 1.5
				})
			} else if (newValue == 3) {
				this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
					url: 'http://localhost:8082/data/terraintiles/wuhan_dsmtiles/',
					requestVertexNormals: true
				})
				this.viewer.camera.flyTo({
					destination: this.Cesium.Cartesian3.fromDegrees(114.35, 30.52, 200),
					duration: 1.5
				})
				this.tifname = "wuhan_dsm_114"
			}
		}
	},
	computed: {
		handImport() {

			if (this.radioPosLength == 0) {
				return true
			}
			else {
				return false
			}
		},
		signBtnName() {
			if (this.signMode) {
				return "选择完成"
			}
			else {
				return "选择电台点位"
			}
		},
		loadingMsg() {
			return this.$store.state.loadingMsg
		},
		cesiumStyle() {
			if (this.signMode) {

				return {
					cursor: 'crosshair'

				}
			} else {

			}
		},


	},
	methods: {
		getDevList() {

		},

		changeLayer() {
			if (!this.isStreetLayer) {
				this.isStreetLayer = true;
				this.nanningStreetLayer = this.viewer.scene.imageryLayers.addImageryProvider(
					new Cesium.UrlTemplateImageryProvider({
						url: 'http://localhost:8082/data/imagetiles/nanningstreet/{z}/{x}/{y}.png',
						transparent: true,
						color: Cesium.Color.WHITE.withAlpha(0.2),
					})
				);
				this.guilinStreetLayer = this.viewer.scene.imageryLayers.addImageryProvider(
					new Cesium.UrlTemplateImageryProvider({
						url: 'http://localhost:8082/data/imagetiles/guilinstreet/{z}/{x}/{y}.png',
						transparent: true,
						color: Cesium.Color.WHITE.withAlpha(0.2),
					})
				);
				this.wuhanStreetLayer = this.viewer.scene.imageryLayers.addImageryProvider(
					new Cesium.UrlTemplateImageryProvider({
						url: 'http://localhost:8082/data/imagetiles/wuhanstreet/{z}/{x}/{y}.png',
						transparent: true,
						color: Cesium.Color.WHITE.withAlpha(0.2),
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
				return
			}
			var url = this.resultImgName
			let a = document.createElement("a"); // 生成一个a元素
			let event = new MouseEvent("click"); // 创建一个单击事件
			a.download = "result"; // 设置图片名称
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
				return
			}
			var tmp_json = {
				type: "FeatureCollection",
				features: []
			}
			for (let i = 0; i < this.radioPos.length; i++) {
				var tmp_fea = {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [
							this.radioPos[i].lon,
							this.radioPos[i].lat,
							this.radioPos[i].height
						]
					},
					properties: {
						name: i
					}

				}
				tmp_json.features.push(tmp_fea)
			}

			let eleLink = document.createElement('a');
			eleLink.download = 'radioPoint.geojson';
			eleLink.style.display = 'none';

			// 这里的data换成你想要导出的JavaScript对象
			let data = tmp_json

			let blob = new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/geojson' })
			eleLink.href = URL.createObjectURL(blob);
			document.body.appendChild(eleLink);
			eleLink.click();

			document.body.removeChild(eleLink);

		},
		ChooseFile(event) {
			console.log('1')
			var that = this
			let file = event.target.files[0]
			console.log('选择完成')
			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (e) {
				var content = e.target.result;

				var json_data = JSON.parse(content)
				console.log(json_data)
				var tmp_radioPosList = json_data.features
				that.radioPosLength = tmp_radioPosList.length
				for (let i = 0; i < that.radioPosLength; i++) {
					var tmp_coord = tmp_radioPosList[i].geometry.coordinates
					let tmp_Point = {
						lon: tmp_coord[0],
						lat: tmp_coord[1],
						height: tmp_coord[2]
					}
					that.radioPos.push(tmp_Point)

					that.ReloadAllMarkers()
				}


			}
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
			this.$refs.uploadGeoJSON.dispatchEvent(new MouseEvent('click'))
		},

		handleCheck(index, row) {

			this.viewer.camera.flyTo({
				destination: this.Cesium.Cartesian3.fromDegrees(Number(row.lon), Number(row.lat), 50),
				duration: 1.5
			});
		},
		handleDelete(index, row) {

			this.radioPos.splice(index, 1)
			this.radioPosLength = this.radioPosLength - 1
			this.ReloadAllMarkers()
		},
		headUpload(params) {
			let param = new FormData();
			param.append("files", params.file);
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
			this.previewVisible = true
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
			if (this.signBtnName == "选择电台点位") {
				this.signMode = true
			}
			else {
				this.signMode = false
			}

		},
		Resize() {
			this.viewer.camera.flyTo({
				destination: this.rectangle,
				duration: 1
			});

		},
		HideImg() {
			var size = this.rectangleEntities.length;
			for(var i=0; i<size; i++){
				this.rectangleEntities[i].show = !this.rectangleEntities[i].show;
			}
		},

		//添加标记点
		//绘制点
		AddSignPoint(longitudeString, latitudeString, height, type, label) {
			var pointPostion = new Cesium.Cartesian3.fromDegrees(longitudeString, latitudeString, height)
			var imageurl = height >= 250 ? './uav1.png' : './电台W.png';
			//如果指定了图标，则优先指定的类型
			if (type == "地面") {
				imageurl = './电台W.png'
			}
			if (type == "空中") {
				imageurl = './uav1.png'
			}
			let x = this.viewer.entities.add({
				name: 'radio',
				longitude: longitudeString,
				latitude: latitudeString,
				height: height,
				position: pointPostion,
				label: {
					text: label,
					font: '14px sans-serif', // 字体样式
					fillColor: Cesium.Color.YELLOW, // 文本填充颜色
					outlineColor: Cesium.Color.BLACK, // 文本轮廓颜色
					outlineWidth: 2, // 文本轮廓宽度
					style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 文本样式
					pixelOffset: new Cesium.Cartesian2(0, -30) // 文本位置偏移
				},
				billboard: {
					image: imageurl,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					scale: 0.5,
				},
			});
			this.radioEntities.push(x)
		},

		ReloadAllMarkers() {
			console.log("line", this.lineEntities)
			console.log("line all", this.viewer.entities)
			for (let i = 0; i < this.radioEntities.length; i++) {
				this.viewer.entities.remove(this.radioEntities[i])
			}
			for (let i = 0; i < this.lineEntities.length; i++) {
				this.viewer.entities.remove(this.lineEntities[i])
			}
			for (let i = 0; i < this.rectangleEntities.length; i++) {
				this.viewer.entities.remove(this.rectangleEntities[i])
			}
			console.log("line array", this.lines)

			this.viewer.entities.removeAll();
			this.radioEntities = []
			this.lineEntities = []
			this.rectangleEntities = []
			for (let i = 0; i < this.radioPos.length; i++) {
				this.AddSignPoint(Number(this.radioPos[i].lon), Number(this.radioPos[i].lat), Number(this.radioPos[i].height), "", this.devOnlineListName[i])
			}
			for (let i = 0; i < this.planRadio.length; i++) {
				this.AddSignPoint(Number(this.planRadio[i].lon), Number(this.planRadio[i].lat), Number(this.planRadio[i].height), this.planRadio[i].prtype, "")
			}
			for (var i = 0; i < this.lines.length; i++) {
				var positions = Cesium.Cartesian3.fromDegreesArrayHeights(this.lines[i]);
				var tpolyline = new Cesium.PolylineGraphics({
					positions: positions,
					width: 2,
					material: Cesium.Color.RED
				});
				this.lineEntities.push(this.viewer.entities.add({
					polyline: tpolyline
				}));
			}
			for (let i = 0; i < this.rectangles.length; i++) {
				var rectCoor = this.rectangles[i];
				let x = this.viewer.entities.add({
					name: 'wuhan30',
					rectangle: {
						coordinates: new Cesium.Rectangle.fromDegrees(rectCoor[0], rectCoor[1], rectCoor[2], rectCoor[3]),
						material: new Cesium.ImageMaterialProperty({
							image: "http://127.0.0.1:8092/resultimages/result_img" + i + ".png", // 替换为你自己的图片路径
							color: Cesium.Color.WHITE.withAlpha(0.2),
							transparent: true,
						})
					}
				});
				this.rectangleEntities.push(x);
			}
		},

		uploadRadioPos() {
			console.log("进入了uploadRadioPos，回调函数成功")
			if (this.isRunning) {
				console.log("后台还在处理，请等待")
				return
			}
			if (this.radioPos.length == 0) {
				// this.$message({
				// 	showClose: true,
				// 	message: '没有在线设备',
				// 	type: 'warning',
				// 	duration: 3000
				// });
				console.log('没有在线设备');
				return
			}
			this.isRunning = true;
			var that = this
			// that.imgLoading = true
			let send = {
				radioPos: this.radioPos,
				tifname: this.tifname,
			}
			that.$store.state.upLoadProgress = 0
			const jsonString = JSON.stringify(send)
			axios.post(
				`${this.$store.state.serverURL}/uploadRadioPos?`, { data: jsonString }).then(
					(res) => {
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
						}
						else {
							this.$message({
								showClose: true,
								message: '服务器错误,请稍后',
								type: 'error',
								duration: 3000
							});
							// this.imgLoading = false
						}

					})
		},


		getDevicesGpsFromOnlineClients() {
			//1.获取所有在线的设备信息	
			console.log("getDevicesGpsFromOnlineClients: begin!")
			console.log("getDevicesGpsFromOnlineClients: ", this.devOnlineList)

			this.devOnlineList.forEach(function (element) {
				this.mClient.requestMsg2GatewayServer('getGps', { devId: element }).then(resp => {
					let tpos = { lon: parseFloat(resp.lng), lat: parseFloat(resp.lat), height: 15 };
					this.radioPos.push(tpos);
					console.log("getDevicesGpsFromOnlineClients: ", element, "+", tpos)
				})
			});
		},


		updateResultImgAndMarkers() {
			this.ReloadAllMarkers();
			//this.viewer.scene.render();
		},

		getDeviceOnlineList() {
			var that = this;

			if (this.sdkclient.mConnected) {
				this.sdkclient.requestMsg2GatewayServer("getDevOnlineList", {}).then(res => {
					const prefix = "3402000000132";
					// 创建正则表达式，其中^表示字符串开始，{n}表示前n位精确匹配
					const regex = new RegExp("^" + prefix.replace(/ /g, "\\s") + ".*");
					var data = res.Content
					var dict = {}
					data.forEach(item => {
						if (item.userType == 11 && regex.test(item.DevId)) {
							dict[item.DevId] = {};
						}
					})
					that.devOnlineList = data;
					that.deviceOnlineGpsList = dict;
				})
			}
			setTimeout(this.getDeviceOnlineList, 10000);
		},

		updateGps() {
			var that = this;
			this.devOnlineList.forEach(item => {
				if (item.userType == 1) {
					var tid = item.DevId;
					this.sdkclient.requestMsg2GatewayServer('getGps', { devId: tid }).then(resp => {
						if (!isNaN(parseFloat(resp.lng))) {
							var lng = parseFloat(resp.lng)
							var lat = parseFloat(resp.lat)
							var cartographic = that.Cesium.Cartographic.fromDegrees(lng, lat);
							console.log("cartographic", cartographic)
							var height = 190;
							height = that.viewer.scene.globe.getHeight(cartographic)
							console.log("cartographic", cartographic.height)
							if (height == null || height < 30) {
								height = 190;
							}
							var tpos = { lon: lng, lat: lat, height: height };
							that.deviceOnlineGpsList[tid] = tpos;
						}
					})
				}
			})

		},

		selectAndUpload() {
			if (this.isAnalying) {
				return;
			}
			var tempPos = [];
			var tempName = []
			var tempPosDad = this.deviceOnlineGpsList
			for (let key in tempPosDad) {
				var tpos = tempPosDad[key];
				if (tpos != null & Object.keys(tpos).length !== 0 & tpos.lat !== 0 & tpos.lng !== 0) {
					tempName.push(this.devNameDict[key]);
					tempPos.push(tpos);
				}
			}
			this.radioPos = tempPos;
			this.devOnlineListName = tempName;
			this.uploadRadioPos();

			setTimeout(this.selectAndUpload, 20000);
		},

		printDevOnlineList() {
			console.log("dev print", this.devOnlineList);
			console.log("dev print2", this.deviceOnlineGpsList);

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
			console.log(value)
		},
		submitPrRadioInfo() {
			let prinfo = {
				prtype: this.chosenPrType,
				height: this.prHeightNum
			}
			this.planRadio.push(prinfo)
			console.log(prinfo)
		},
		handleDelPrinfo(index, row) {
			this.planRadio.splice(index, 1)
		},
		analysePlanRadio() {
			// if (this.planRadio.length != 1){
			// 	console.log('只支持一个计划点位')
			// 	return
			// }
			//上传数据：四个指标
			if (this.isRunning) {
				console.log("后台正在处理")
				return
			}
			this.isAnalying = true
			this.isRunning = true
			let sendData = {
				radioPos: this.radioPos,
				maxGroundHeight: this.maxGroundHeight,
				maxGroundNum: this.maxGroundNum,
				maxFlyHeight: this.maxFlyHeight,
				maxFlyNum: this.maxFlyNum,
				tifname: this.tifname,
			}
			var that = this
			sendData = JSON.stringify(sendData)
			axios.post(`${this.$store.state.serverURL}/analysePlanRadio?`, { data: sendData }).then(
				(res) => {
					if (res.status == 200) {
						this.$message({
							showClose: true,
							message: '更新成功',
							type: 'success',
							duration: 3000
						});
						//不满足时弹窗提示不满足
						if (res.data.find == 0) {
							alert("不满足，请添加最大可用点")
							that.isAnalying = false
							that.isRunning = false
							// that.selectAndUpload()
							return
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
						setTimeout(function () {
							console.log("重新开始态势更新")
							that.planRadio = []
							that.lines = []
							that.rectangles = []
							that.updateResultImgAndMarkers()
							that.isAnalying = false
							that.selectAndUpload()
						}, 30000)
					}
					else {
					
						this.$message({
							showClose: true,
							message: '服务器错误,请稍后',
							type: 'error',
							duration: 3000
						});
					}
				}
			)


		},

		init() {
			//Cesium.Ion.defaultAccessToken =
			//	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTA1MWU5Ny1jZTk5LTRlMWYtYWQxMi05OGJmNGUyYmZlMDgiLCJpZCI6NjMyMTEsImlhdCI6MTYyNzk1NTY0MX0.r5WqT4nO5JbOyrA415W7Zbk139BbqxBtpgeNZ2slM1g'

			var that = this
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
			//添加在线dsm。
			// viewer.terrainProvider=Cesium.createWorldTerrain();
			//添加离线dsm，依托cesium ion发布
			// viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
			// 	url: 'http://localhost:8080/terrain/wuhan_dsmtiles/',
			// 	// url: "http://localhost:8080/terrain/guangxi_guilin_dsmtiles/",
			// 	// url: "http://localhost:9003/terrain/P7l7gB2a/",
			// 	requestVertexNormals: true
			// })
			// //添加结果切片
			viewer.scene.imageryLayers.addImageryProvider(
				new Cesium.UrlTemplateImageryProvider({
					url: 'http://localhost:8082/data/imagetiles/guilin1/{z}/{x}/{y}.png',
					transparent: true,
					color: Cesium.Color.WHITE.withAlpha(0.2),
				})
			);
			viewer.scene.imageryLayers.addImageryProvider(
				new Cesium.UrlTemplateImageryProvider({
					url: 'http://localhost:8082/data/imagetiles/guilin2/{z}/{x}/{y}.png',
					transparent: true,
					color: Cesium.Color.WHITE.withAlpha(0.2),
				})
			);
			viewer.scene.imageryLayers.addImageryProvider(
				new Cesium.UrlTemplateImageryProvider({
					url: 'http://localhost:8082/data/imagetiles/nanning/{z}/{x}/{y}.png',
					transparent: true,
					color: Cesium.Color.WHITE.withAlpha(0.2),
				})
			);
			viewer.scene.imageryLayers.addImageryProvider(
				new Cesium.UrlTemplateImageryProvider({
					url: 'http://localhost:8082/data/imagetiles/wuhan/{z}/{x}/{y}.png',
					transparent: true,
					color: Cesium.Color.WHITE.withAlpha(0.2),
				})
			);
			//设置影像切片透明度
			// resultlayer.alpha = 0.2; // 设置透明度为 0.5

			//双击鼠标左键清除默认事件
			viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

			viewer.scene.globe.depthTestAgainstTerrain = true

			var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
			handler.setInputAction(function (evt) {
				// 返回一个ray和地球表面的一个交点的Cartesian3坐标。
				let ray = viewer.camera.getPickRay(evt.position);
				let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
				// // 空间坐标转世界坐标(弧度)
				let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				// 弧度转为角度（经纬度）
				let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);  //经度值
				let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6); //纬度值
				// 地形高度(下面两个二选一就行)
				let height = cartographic.height.toFixed(2);
				let height2 = viewer.scene.globe.getHeight(cartographic)
				console.log(lon, lat, height, height2)
				if (that.signMode) {
					let tmp_Point = {
						lon: lon,
						lat: lat,
						height: height
					}
					that.radioPos.push(tmp_Point)
					that.radioPosLength = that.radioPosLength + 1
					that.ReloadAllMarkers()
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

			that.viewer = viewer
			that.Cesium = Cesium
		}


	},
	mounted() {
		this.init();
		// //链接网关
		this.sdkclient = new SdkDemo();
		this.sdkclient.connect(this.gatewayUrl, this.username, this.password, null, null)
		//获取在线设备列表
		setTimeout(this.getDeviceOnlineList, 1000);
		//添加监听器
		this.sdkclient.addObserver('gpsUpload', msg => {
			if (msg.method == 'gpsUpload') {
				var data = msg.data;
				var id = data.devId;
				if (id in this.devNameDict) {
					if (!isNaN(parseFloat(data.lng))) {
						var lng = parseFloat(data.lng)
						var lat = parseFloat(data.lat)
						if(lat == 0 || lng ==0){
							return;
						}
						var cartographic = this.Cesium.Cartographic.fromDegrees(lng, lat);
						// console.log("cartographic lon", lng, " ",lat)
						// console.log("cartographic", cartographic)
						// console.log("cartographic", cartographic.height)
						var height = 190;
						height = this.viewer.scene.globe.getHeight(cartographic).toFixed(2)
						console.log("height", height)
						if (height == null || height < 30) {
							height = 190;
						}
						var tpos = { lon: lng, lat: lat, height: height };
						this.deviceOnlineGpsList[id] = tpos;
					}
				}
			}
		})
		//开启动态更新坐标函数	
		this.printDevOnlineList();
		//开启动态上传坐标进行态势感知函数
		this.selectAndUpload();
	},

	destroyed() {
	}
}
</script>

<style>
#cesiumContainer {

	height: 900px;

}

.cesiumbox {
	margin-top: 0%;
	margin-left: 22%;
	height: 900px;
	z-index: 0;
	width: 76%;
	margin-top: 1%;
	position: absolute;
	box-shadow: 3px 3px 3px 3PX #d0d0d0;
}

.operationTable {
	border: 1px solid;
	border-color: #969696;
	width: 20%;
	height: 900px;
	left: 10px;
	position: absolute;
	border-radius: 5px;
	margin-top: 1%;
	overflow: hidden;
	display: inline-block;

}

.hide .el-upload--picture-card {
	display: none;
}

.Hide {
	background-size: cover; /* 或者其他适合的大小调整值 */
	background-position: center; /* 图片位置 */
	border: none; /* 移除边框 */
	padding: 0; /* 移除内边距 */
	position: absolute;
	right: 20px;
	bottom: 80px;
	height: 40px;
	width: 45px;
	cursor: pointer;
	z-index: 1;
	opacity: 0.7;
}

.Resize {
	position: absolute;
	right: 20px;
	bottom: 30px;
	height: 40px;
	cursor: pointer;
	z-index: 1;
	opacity: 0.7;
	background-color: rgb(123, 195, 7);
	border-color: gray;
}

.Change {
	background-size: cover; /* 或者其他适合的大小调整值 */
	background-position: center; /* 图片位置 */
	border: none; /* 移除边框 */
	padding: 0; /* 移除内边距 */
	position: absolute;
	right: 20px;
	bottom: 130px;
	height: 40px;
	width: 45px;
	cursor: pointer;
	z-index: 1;
	opacity: 0.7;

}

.modal {
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 114514;
	width: 100%;
	height: 100%;
	position: absolute;
}
</style>
