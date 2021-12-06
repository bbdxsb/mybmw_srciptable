// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: yin-yang;
//
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule;// 
const { Base } = require('./开发环境');

// @组件代码开始

let DEPENDENCIES = [
    'jsencrypt.js' //本地化加密
];


let BMW_SERVER_HOST = 'https://myprofile.bmw.com.cn';
let JS_CDN_SERVER = 'https://cdn.jsdelivr.net/gh/opp100/bmw-scriptable-widgets/lib';

let DEFAULT_BG_COLOR_LIGHT = '#cc3399';
let DEFAULT_BG_COLOR_DARK = '#0099ff';
let DEFAULT_LOGO_LIGHT = 'https://z3.ax1x.com/2021/11/16/IRfMQO.png';
let DEFAULT_FG_COLOR = '#111111';
let DEFAULT_FG_COLOR_OPTICAL = '0.15';
let MAPAPIKEY = '1b96b24cade3b58737ef6b5e142cb8c3';
let WEATHERKEY = '6LBqE0F459FuHgIq'
// header is might be used for preventing the bmw block the external api?
let BMW_HEADERS = {
    'user-agent': 'Dart/2.10 (dart:io)',
    'x-user-agent': 'ios(15.0.2);bmw;1.6.6(10038)'
};

// setup local storage keys
let MY_BMW_REFRESH_TOKEN = 'MY_BMW_REFRESH_TOKEN';
let MY_BMW_TOKEN = 'MY_BMW_TOKEN';
let MY_BMW_TOKEN_UPDATE_LAST_AT = 'MY_BMW_TOKEN_UPDATE_LAST_AT';
let MY_BMW_LAST_CHECK_IN_AT = 'MY_BMW_LAST_CHECK_IN_AT';
let APP_USE_AGREEMENT = 'APP_USE_AGREEMENT';
let MY_BMW_VEHICLE_UPDATE_LAST_AT = 'MY_BMW_VEHICLE_UPDATE_LAST_AT';
let MY_BMW_VEHICLE_DATA = 'MY_BMW_VEHICLE_DATA';
let REMAIL_OIL_KM = 90;

let BACK_COLOR = new Color('#ffffff', 0.1);
let LOGO_SIZE = 18;

let CORRER_RADIUS = 10;
let FONNT_SIZE = 15
let DISTANCE = 1000
class Widget extends Base {

    //#region 组件

    //#region 组件加载
    async render() {
        // check all dependencies
        await this.getDependencies();

        await this.renderError('载入中...');
        if (this.userConfigData.username == '') {
            console.error('尚未配置用户');
            return await this.renderError('请先配置用户');
        }
        let screenSize = Device.screenSize();
        let data = await this.getData();

        if (data == null) {
            console.log('获取车辆信息失败，请检查授权')
        }
        else {
            try {
                data.size = this.DeviceSize[`${screenSize.width}x${screenSize.height}`] || this.DeviceSize['375x812'];
                console.log(screenSize)
            } catch (e) {
                console.warn('Display Error: ' + e.message);
                await this.renderError('显示错误：' + e.message);
            }
            let w = new ListWidget();
          let  img
            switch (this.widgetFamily) {
                case 'large':
                    w = await this.renderLarge(data);
                    img = this.getBackgroundImage('large'); 
                    break;
                case 'medium':
                    w = await this.renderMedium(data);
                    img = this.getBackgroundImage('medium'); 
                    break;
                default:
                    w = await this.renderSmall(data);
                    img = this.getBackgroundImage('small'); 
                    break;
            }
            if (img) {
                w.backgroundImage = img
            }
            else if (this.userConfigData.bgImageMid) {
                let bgImageUrl = this.userConfigData.bgImageMid;
                const image = await this.getImageByUrl(bgImageUrl)
                w.backgroundImage = image
            }
            else {
                w.backgroundGradient = this.getBackgroundColor()
            }
            return w;
        }
    }
    //#endregion

    //#region  小组件
    async renderSmall(data) {
        let w = new ListWidget();
        const padding = 8
        const { width, height } = data.size['small'];
        const box = w.addStack()
        box.size = new Size(width, height)
        box.setPadding(padding, padding, padding, padding)
        box.layoutVertically()
        const fontColor = this.getFontColor()
        const headBox = box.addStack()
        headBox.layoutHorizontally()

        const {
            rangeValue,
            rangeUnits,
        } = data.status.fuelIndicators[0]

        //油位
        const rangeBox = headBox.addStack()
        rangeBox.bottomAlignContent()
        rangeBox.setPadding(0, 2, 0, 0)
        //百分比
        let fuelPercentage = this.getOilPercent(data)
        const oilPercentTxt = rangeBox.addText(`${fuelPercentage}`)
        oilPercentTxt.font = this.provideFont('bold', 24)
        oilPercentTxt.textColor = fontColor
        oilPercentTxt.minimumScaleFactor = 0.8
        oilPercentTxt.lineLimit = 1
        this.addFontShadow(oilPercentTxt)
        //%
        const percentageBox = rangeBox.addStack();
        percentageBox.setPadding(0, 0, 3, 0)
        const percentageText = percentageBox.addText(' %  /  ')
        percentageText.font = this.provideFont('regular', 13)
        percentageText.textColor = fontColor
        percentageText.lineLimit = 1
        this.addFontShadow(percentageText)
        //续航里程
        const rangeValueText = rangeBox.addText(rangeValue)
        rangeValueText.font = this.provideFont('bold', 24)
        rangeValueText.textColor = fontColor
        rangeValueText.minimumScaleFactor = 0.8
        rangeValueText.lineLimit = 1
        this.addFontShadow(rangeValueText)
        //km
        const rangeUnitsBox = rangeBox.addStack();
        rangeUnitsBox.setPadding(0, 0, 3, 0)
        const rangeUnitsText = rangeUnitsBox.addText(' ' + rangeUnits)
        rangeUnitsText.font = this.provideFont('regular', 13)
        rangeUnitsText.textColor = fontColor
        rangeUnitsText.lineLimit = 1
        this.addFontShadow(rangeUnitsText)

        //车型图片  
        box.addSpacer(2)
        let imageCar = await this.getCarCanvasImage(data, width - padding*2, (height - padding * 2) * 0.6); 
        box.addImage(imageCar)

        //车型名称
        box.addSpacer(2)
        let carName = `${data.brand} ${data.bodyType} ${data.model}`
        if (this.userConfigData.custom_name.length > 0) {
            carName = this.userConfigData.custom_name
        }
        const carNameBox = box.addStack()
        carNameBox.addSpacer(null)
        const carNameText = carNameBox.addText(carName)
        carNameBox.addSpacer(null)
        carNameText.font = this.provideFont('black', 20)
        carNameText.textColor = fontColor
        carNameText.minimumScaleFactor = 0.5
        carNameText.lineLimit = 1
        this.addFontShadow(carNameText)
        w.url = 'de.bmw.connected.mobile20.cn.Share-Ext.Destination://'
        return w;
    }
    //#endregion

    //#region  中组件-信息
    async renderMedium(data) {
        const padding = 8
        let w = new ListWidget()
        const { width, height } = data.size['medium'];
        w.setPadding(padding, padding, padding, padding)
        let fontColor = this.getFontColor()
        let mainBox = w.addStack()
        switch (this.settings['TypeConfig']) {
            case 1:
                mainBox = await this.getMapBox(mainBox, data, width, height, padding, fontColor)
                break
            default:
                mainBox = await this.getCarInfo(mainBox, data, width, height, padding, fontColor)
        }
        return w;
    }

    async getCarInfo(box, data, width, height, padding, fontColor, isLarge = false) {
        const {
            rangeValue,
            rangeUnits,
        } = data.status.fuelIndicators[0]
        box.layoutHorizontally()
        const boxWidth = width / 2 - padding * 1.5
        const boxHeight = height - padding * 2
        console.log(boxWidth + ',' + boxHeight)
        const leftBox = box.addStack()
        leftBox.size = new Size(boxWidth, boxHeight)
        leftBox.layoutVertically()
        box.addSpacer(padding)
        const rightBox = box.addStack()
        rightBox.size = new Size(boxWidth, boxHeight)
        rightBox.layoutVertically()

        leftBox.setPadding(padding/2, padding /2, padding/2, padding/2)
        leftBox.cornerRadius = CORRER_RADIUS
        leftBox.backgroundColor = BACK_COLOR
        leftBox.layoutVertically()
        //logo
        const headBox = leftBox.addStack()
        headBox.layoutHorizontally()
        const logoBox = headBox.addStack()
        logoBox.size = new Size(LOGO_SIZE * 2.5, LOGO_SIZE)
        let logoImage = logoBox.addImage(await this.getAppLogo())
        if (!this.userConfigData.custom_logo_image) {
            logoImage.tintColor = this.getFontColor()
        }
        logoBox.centerAlignContent()
        logoBox.addSpacer(null)
        headBox.addSpacer(null)

        //车牌号
        const msgBox = headBox.addStack()
        msgBox.bottomAlignContent()
        const msgText = msgBox.addText(data.licensePlate)
        if (this.userConfigData.licensePlate) {
            msgText.text = this.userConfigData.licensePlate
        }
        msgText.font = this.provideFont('medium', FONNT_SIZE)
        msgText.textColor = fontColor
        msgText.minimumScaleFactor = 0.8
        this.addFontShadow(msgText)
        //车型图片  
        if (isLarge) {
            leftBox.addSpacer(null)
        }
        else
        {
            leftBox.addSpacer(4)
        }
        //let imageCar = await this.getVehicleImage(data);
        let imageCar = await this.getCarCanvasImage(data, boxWidth - padding, boxHeight* 0.62);
        let carImageBox = leftBox.addStack()
        carImageBox.size = new Size(boxWidth - padding , 0)
        let carImage = carImageBox.addImage(imageCar)
        if (isLarge) {
            leftBox.addSpacer(null)
        }
        else
        {
            leftBox.addSpacer(4)
        }
        //车型名称
        let carName = `${data.brand} ${data.bodyType} ${data.model}`
        if (this.userConfigData.custom_name.length > 0) {
            carName = this.userConfigData.custom_name
        }
        const carNameBox = leftBox.addStack()
        carNameBox.addSpacer(null)
        const carNameText = carNameBox.addText(carName)
        carNameBox.addSpacer(null)
        carNameText.font = this.provideFont('black', 22)
        carNameText.textColor = fontColor
        carNameText.minimumScaleFactor = 0.5
        carNameText.lineLimit = 1
        this.addFontShadow(carNameText)
        //右边
        const carInfoBox = rightBox.addStack()
        carInfoBox.setPadding(padding/2, padding/2, 0, padding/2)
        carInfoBox.cornerRadius = CORRER_RADIUS
        carInfoBox.backgroundColor = BACK_COLOR
        carInfoBox.layoutVertically()
        //剩余燃油
        const oilBox = carInfoBox.addStack()
        oilBox.layoutVertically()
        const oilInfoBox = oilBox.addStack()
        oilInfoBox.centerAlignContent()
        const oilIconBox = oilInfoBox.addStack()
        oilIconBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        oilIconBox.setPadding(2, 0, 2, 4)
        const oilIcon = oilIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPHyLt.png'))
        oilIcon.size = new Size(LOGO_SIZE, LOGO_SIZE)
        let fuelPercentage = this.getOilPercent(data)
        const oilPercentTxt = oilInfoBox.addText(`${fuelPercentage}%`)
        oilPercentTxt.font = this.provideFont('medium', 12)
        this.addFontShadow(oilPercentTxt)
        oilInfoBox.addSpacer(null)
        if (rangeValue <= REMAIL_OIL_KM) {
            oilIcon.tintColor = new Color('#ff0000', 1)
            oilPercentTxt.textColor = new Color('#ff0000', 1)
        }
        else {
            oilIcon.tintColor = fontColor
            oilPercentTxt.textColor = fontColor
        }

        //更新时间
        oilInfoBox.addSpacer(null)
        const updateTxt = oilInfoBox.addText(this.formatDate(data))
        updateTxt.font = this.provideFont('medium', 12)
        updateTxt.textColor = fontColor
        this.addFontShadow(updateTxt)
        const updateIcon = await this.getImageByUrl('https://z3.ax1x.com/2021/11/27/omF4Bt.png')
        const updateIconBox = oilInfoBox.addStack()
        updateIconBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        updateIconBox.setPadding(2, 4, 2, 0)
        updateIconBox.addImage(updateIcon).tintColor = fontColor

        // //车门信息
        // const doorIcon = await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPb71H.png')
        // const doorBox = oilInfoBox.addStack()
        // doorBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        // if (!data.properties.areDoorsClosed) {
        //     doorBox.addImage(doorIcon).tintColor = Color.red()
        // }
        // //车窗信息
        // oilInfoBox.addSpacer(null)
        // const windowIcon = await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPbT9e.png')
        // const windowBox = oilInfoBox.addStack()
        // windowBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        // if (!data.properties.areWindowsClosed) {
        //     windowBox.addImage(windowIcon).tintColor = Color.red()
        // }
        // //锁车信息
        // oilInfoBox.addSpacer(null)
        // const clockBox = oilInfoBox.addStack()
        // clockBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        // let clockImage;
        // if (data.properties.areDoorsLocked) {
        //     clockImage = clockBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/21/IjAhwT.png'))
        //     clockImage.tintColor = fontColor
        // }
        // else {
        //     clockImage = clockBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/21/IjAoY4.png'))
        //     clockImage.tintColor = Color.red()
        // }

        //进度条
        oilBox.addSpacer(8)
        const processBarBox = oilBox.addStack()
        const allLength = width / 2 - padding * 1.5 - padding 
        processBarBox.size = new Size(allLength, 0)
        const remainOilProcessBox = processBarBox.addStack()
        remainOilProcessBox.backgroundColor = fontColor
        remainOilProcessBox.size = new Size(allLength * (fuelPercentage / 100), 12)
        remainOilProcessBox.cornerRadius = 6
        processBarBox.addSpacer(null)
        processBarBox.backgroundColor = new Color('#111111', 0.2)
        processBarBox.cornerRadius = 6
        carInfoBox.addSpacer(null)

        //剩余里程
        const rangeBox = carInfoBox.addStack()
        rangeBox.layoutHorizontally()
        rangeBox.bottomAlignContent()
        const rangeIconBox = rangeBox.addStack();
        rangeIconBox.centerAlignContent()
        rangeIconBox.size = new Size(22, 26)
        rangeIconBox.setPadding(0, 0, 4, 0)
        const rangeIcon = rangeIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPbt6s.png'))
        rangeIcon.size = new Size(LOGO_SIZE, LOGO_SIZE)
        rangeIcon.tintColor = fontColor
        rangeBox.addSpacer(6)
        const rangeValueBox = rangeBox.addStack();
        const rangeValueTxt = rangeValueBox.addText(rangeValue)
        rangeValueTxt.font = this.provideFont('black', 50)
        rangeValueTxt.textColor = fontColor
        rangeValueTxt.minimumScaleFactor = 0.7
        this.addFontShadow(rangeValueTxt)
        rangeBox.addSpacer(4)
        const rangeUnitsBox = rangeBox.addStack();
        rangeUnitsBox.setPadding(0, 0, 4, 0)
        const rangeUnitsTxt = rangeUnitsBox.addText(rangeUnits)
        rangeUnitsTxt.font = this.provideFont('bold', FONNT_SIZE)
        rangeUnitsTxt.textColor = fontColor
        rangeUnitsTxt.minimumScaleFactor = 0.8
        this.addFontShadow(rangeUnitsTxt)
        rightBox.addSpacer(padding)

        //总里程
        const otherInfoBox = rightBox.addStack()
        otherInfoBox.setPadding(padding , padding /2, padding, padding /2)
        otherInfoBox.cornerRadius = CORRER_RADIUS
        otherInfoBox.backgroundColor = BACK_COLOR
        otherInfoBox.addSpacer(null)
        const allMileageTxt = otherInfoBox.addText(`总里程：${data.status.currentMileage.mileage} ${data.status.currentMileage.units}`)
        allMileageTxt.font = this.provideFont('medium', FONNT_SIZE)
        allMileageTxt.textColor = fontColor
        this.addFontShadow(allMileageTxt)
        otherInfoBox.addSpacer(null)
        allMileageTxt.minimumScaleFactor = 0.8
        allMileageTxt.lineLimit = 1
        //跳转my bmw
        box.url = 'de.bmw.connected.mobile20.cn.Share-Ext.Destination://'
        return box;
    }
    //#endregion

    //#region 中组件-地图
    async getMapBox(box, data, width, height, padding, fontColor) {
        box.layoutHorizontally()
        const boxWidth = width / 2 - padding * 1.5
        const boxHeight = height - padding * 2
        const leftBox = box.addStack()
        box.addSpacer(padding)
        //左边窗口
        leftBox.size = new Size(boxWidth, boxHeight)
        //右边窗口
        const rightBox = box.addStack()
        rightBox.size = new Size(boxWidth, boxHeight)
        rightBox.f
        rightBox.layoutVertically()
        let {
            longitude,
            latitude
        } = data.properties.vehicleLocation.coordinates

        //加载地图
        let mapImage = await this.loadMapView(`${longitude},${latitude}`, boxWidth, boxHeight);
        mapImage.opacity = 0.5
        leftBox.cornerRadius = CORRER_RADIUS
        leftBox.backgroundColor = BACK_COLOR
        leftBox.backgroundImage = mapImage
        leftBox.url = 'caiyunappfree://'
        let weatherData = null;
        //获取天气
        if (WEATHERKEY) {

            const mapBackgroundColor = new Color('#FAF7F0', 0.8)
            const mapFontColor = new Color('#ABAAA9', 1)
            weatherData = await this.getWeather(longitude, latitude)
            let mapBox = leftBox.addStack()
            mapBox.layoutVertically()

            //添加天气信息
            const leftHeadBox = mapBox.addStack();
            const weatherBox = leftHeadBox.addStack();
            weatherBox.layoutVertically()
            weatherBox.setPadding(0, 4, 0, 4)
            weatherBox.size = new Size(45, 0)
            //天气图标      
            const weatherIncoBox = weatherBox.addStack()
            weatherIncoBox.setPadding(4, 5, 0, 5)
            const weatherInco = weatherIncoBox.addImage(await this.getSFSymbol(this.WeatherIcos[weatherData.weatherIco]))
            weatherBox.addSpacer(2)
            //最低温，最高温
            const temperatureBox = weatherBox.addStack()
            temperatureBox.backgroundColor = mapBackgroundColor
            temperatureBox.cornerRadius = 5
            const temperatureText = temperatureBox.addText(`${weatherData.minTemperature}~${weatherData.maxTemperature}`)
            //const temperatureText = temperatureBox.addText(`-88~-88`)
            temperatureText.font = this.provideFont('regular', 12)
            temperatureText.textColor = mapFontColor
            temperatureText.minimumScaleFactor = 0.5
            temperatureText.lineLimit = 1

            //预警或者天气描述
            mapBox.addSpacer(null)
            const bottomBox = mapBox.addStack();
            bottomBox.backgroundColor = mapBackgroundColor
            bottomBox.setPadding(3, 2, 0, 2)
            bottomBox.size = new Size(boxWidth, 16)
            let alertIfno = weatherData.weatherDesc
            if (weatherData.alertWeatherTitle) {
                alertIfno = weatherData.alertWeatherTitle
            }
            const alertIfnoText = bottomBox.addText(alertIfno)
            alertIfnoText.font = this.provideFont('bold', 12)
            alertIfnoText.textColor = mapFontColor
            alertIfnoText.minimumScaleFactor = 0.6
        }

        //车辆位置
        const addressInfoBox = rightBox.addStack()
        addressInfoBox.Size = new Size(0, boxHeight / 2 - padding / 2)
        addressInfoBox.layoutVertically()
        addressInfoBox.setPadding(padding/2, padding/2, padding/2, padding/2)
        addressInfoBox.backgroundColor = BACK_COLOR
        addressInfoBox.cornerRadius = CORRER_RADIUS
        addressInfoBox.url = this.buildMapURL(longitude, latitude, data.properties.vehicleLocation.address.formatted)
        //图标
        const locationBox = addressInfoBox.addStack()
        locationBox.size = new Size(boxWidth - padding , LOGO_SIZE)
        const locationIconBox = locationBox.addStack()
        const locationIcon = locationIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/21/IjA8Fe.png'))
        locationIconBox.addSpacer(padding/2)
        locationIcon.tintColor = fontColor
        locationIcon.size = new Size(LOGO_SIZE, LOGO_SIZE)
        const locationText = locationBox.addText(`定位`)
        locationText.font = this.provideFont('heavy', FONNT_SIZE)
        locationText.textColor = fontColor
        this.addFontShadow(locationText)
        locationBox.addSpacer(null)
        locationBox.centerAlignContent()
        if (weatherData) {
            const temperatureText = locationBox.addText(`${weatherData.temperature}℃`)
            temperatureText.font = this.provideFont('medium', 12)
            temperatureText.textColor = fontColor
            this.addFontShadow(temperatureText)
            // const thermometerImageBox = locationBox.addStack()
            // thermometerImageBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
            // const thermometerImage = thermometerImageBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/23/oS0rCV.png'))
            // thermometerImage.tintColor = fontColor
        }
        //位置文本
        addressInfoBox.addSpacer(null)
        let addressStr = data.properties.vehicleLocation.address.formatted.replace(/.+?(省|市|自治区|自治州)/g, '')
        const addressBoxTxt = addressInfoBox.addText(addressStr)
        addressBoxTxt.font = this.provideFont('medium', 12)
        addressBoxTxt.textColor = fontColor
        addressBoxTxt.line = 2
        this.addFontShadow(addressBoxTxt)

        //导航计算
        let plate = data.licensePlate
        if (this.userConfigData.licensePlate) {
            plate = this.userConfigData.licensePlate
        }
        let distance = 0
        let duration = 0
        let text = '回家'
        let url = ''

        let distanceHome = 0
        let durationHome = 0
        let distanceCompany = 0
        let durationCompany = 0
        const lonHmoe = this.addressConfigData.home.split(',')[0]
        const latHome = this.addressConfigData.home.split(',')[1]
        const lonCompany = this.addressConfigData.company.split(',')[0]
        const latCompany = this.addressConfigData.company.split(',')[1]

        //获取路径规划数据
        if (this.addressConfigData.home) {
            let pathData = await this.getPath(longitude, latitude, lonHmoe, latHome, plate)
            distanceHome = pathData.route.paths[0].distance
            durationHome = pathData.route.paths[0].cost.duration
        }
        if (this.addressConfigData.company) {
            let pathData = await this.getPath(longitude, latitude, lonCompany, latCompany, plate)
            distanceCompany = pathData.route.paths[0].distance
            durationCompany = pathData.route.paths[0].cost.duration
        }
        if (distanceHome < DISTANCE) {
            //在家一公里附近
            if (distanceCompany > DISTANCE) {
                text = '去公司'
                url = this.buildMapURL(lonCompany, latCompany, text)
                if (this.addressConfigData.companywaypoints) {
                    console.log('在家一公里附近,距离公司超过一公里，有配置去公司的途经点')
                    let pathData = await this.getPath(longitude, latitude, lonCompany, latCompany, plate, this.addressConfigData.companywaypoints)
                    distance = pathData.route.paths[0].distance
                    duration = pathData.route.paths[0].cost.duration
                }
                else {
                    console.log('在家一公里附近,距离公司超过一公里，未配置去公司的途经点')
                    distance = distanceCompany
                    duration = durationCompany
                }
            } else {
                console.log('在家一公里附近, 回家不经过途经点')
                text = '回家'
                url = this.buildMapURL(lonHmoe, latHome, text)
                distance = distanceHome
                duration = durationHome
            }
        }
        else {
            url = this.buildMapURL(lonHmoe, latHome, text)
            text = '回家'
            if (distanceCompany < DISTANCE && this.addressConfigData.homewaypoints) {
                console.log('离开家一公里,与公司距离小于一公里，有配置回家的途经点')
                let pathData = await this.getPath(longitude, latitude, lonHmoe, latHome, plate, this.addressConfigData.homewaypoints)
                distance = pathData.route.paths[0].distance
                duration = pathData.route.paths[0].cost.duration
            }
            else {
                console.log('离开家一公里,与公司距离大于一公里，回家且不经过途经点')
                distance = distanceHome
                duration = durationHome
            }
        }

        //填充导航数据
        rightBox.addSpacer(padding/2)
        const pathBox = rightBox.addStack()
        pathBox.url = url;
        pathBox.Size = new Size(0, boxHeight / 2 - padding / 2)
        pathBox.layoutVertically()
        pathBox.setPadding(padding/2, padding/2, padding/2, padding/2)
        pathBox.backgroundColor = BACK_COLOR
        pathBox.cornerRadius = CORRER_RADIUS

        const titleBox = pathBox.addStack()
        titleBox.layoutHorizontally()
        titleBox.size = new Size(boxWidth - padding , LOGO_SIZE)
        //图标
        const iconBox = titleBox.addStack()
        iconBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        const carIcon = iconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/21/IjAkoF.png`))
        carIcon.tintColor = fontColor

        //地址
        titleBox.addSpacer(padding/2)
        const textText = titleBox.addText(text)
        textText.font = this.provideFont('heavy', FONNT_SIZE)
        textText.textColor = fontColor
        this.addFontShadow(textText)
        titleBox.addSpacer(null)
        // //降雨概率
        // if (weatherData) {
        //     const probabilityText = titleBox.addText(`${weatherData.probability}`)
        //     //const probabilityText = titleBox.addText(`23`)
        //     probabilityText.font = this.provideFont('medium', FONNT_SIZE)
        //     probabilityText.textColor = fontColor
        //     const probabilityImageBox = titleBox.addStack()
        //     probabilityImageBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        //     const probabilityImage = probabilityImageBox.addImage(await this.getImageByUrl('https://s3.ax1x.com/2021/01/23/sHic0s.png'))
        //     probabilityImage.tintColor = fontColor
        // }

        //预计用时
        const durationBox = titleBox.addStack()
        let min = parseInt((duration / 60).toString())
        let timeStr
        if (min >= 60) {
            const hour = parseInt((min / 60).toString())
            min = min % 60
            timeStr = `${hour}h`
            if (min > 0) {
                timeStr += ` ${min}min`
            }
        }
        else {
            timeStr = `${parseInt((duration / 60).toString())} min`
        }
        const durationText = durationBox.addText(timeStr)
        durationText.font = this.provideFont('medium', 12)
        durationText.textColor = fontColor
        durationText.minimumScaleFactor = 0.8
        this.addFontShadow(durationText)
        titleBox.centerAlignContent()
        //下部内容
        const bottomBox = pathBox.addStack();
        bottomBox.layoutHorizontally()
        const messageBox = bottomBox.addStack();
        messageBox.layoutVertically()


        //距离
        messageBox.addSpacer(null)
        const distanceBox = messageBox.addStack()
        distanceBox.addSpacer(2)
        const distanceIconBox = distanceBox.addStack()
        distanceIconBox.size = new Size(FONNT_SIZE, FONNT_SIZE)
        distanceIconBox.setPadding(0,0,1,0)
        const distanceImage = distanceIconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/21/IjesH0.png`))
        distanceImage.tintColor = fontColor
        distanceBox.addSpacer(padding/2+2)
        const distanceText1 = distanceBox.addText(`路线距离`)
        distanceText1.font = this.provideFont('medium', 12)
        distanceText1.textColor = fontColor
        this.addFontShadow(distanceText1)
        distanceBox.addSpacer(null)
        const distanceText2 = distanceBox.addText(`${(distance / 1000).toFixed(1)} km`)
        distanceText2.font = this.provideFont('medium', 12)
        distanceText2.textColor = fontColor
        this.addFontShadow(distanceText2)
        //更新时间
        messageBox.addSpacer(2)
        const updateBox = messageBox.addStack()
        updateBox.addSpacer(2)
        const updateIconBox = updateBox.addStack()
        updateIconBox.size = new Size(FONNT_SIZE, FONNT_SIZE)
        updateIconBox.setPadding(1,0,1,0)
        const updateImage = updateIconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/21/IjkWIe.png`))
        updateImage.tintColor = fontColor
        updateBox.addSpacer(padding/2+2)
        const updateText1 = updateBox.addText(`更新时间`)
        updateText1.font = this.provideFont('medium', 12)
        updateText1.textColor = fontColor
        this.addFontShadow(updateText1)
        updateBox.addSpacer(null)
        const updateText2 = updateBox.addText(this.formatDate())
        updateText2.font = this.provideFont('medium', 12)
        updateText2.textColor = fontColor
        this.addFontShadow(updateText2)
        return box
    }
    //#endregion

    //#region  大组件

    async renderLarge(data) {
        let w = new ListWidget()
        const padding = 8
        const { width, height } = data.size['large'];
        let fontColor = this.getFontColor()
        //上部
        let topBox = w.addStack()
        topBox.setPadding(padding * 2, padding, padding, padding)
        topBox = await this.getCarInfo(topBox, data, width, height / 2 - padding * 1.5, padding, fontColor, true);
        //下部
        let bottomBox = w.addStack()
        bottomBox.setPadding(padding, padding, padding * 2, padding)
        bottomBox = await this.getMapBox(bottomBox, data, width, height / 2 - padding * 1.5, padding, fontColor)
        return w;
    }
    //#endregion

    //#endregion

   

    WeatherIcos = {
        CLEAR_DAY: 'sun.max.fill', // 晴（白天） CLEAR_DAY 
        CLEAR_NIGHT: 'moon.stars.fill', // 晴（夜间） CLEAR_NIGHT 
        PARTLY_CLOUDY_DAY: 'cloud.sun.fill', // 多云（白天）  PARTLY_CLOUDY_DAY 
        PARTLY_CLOUDY_NIGHT: 'cloud.moon.fill', // 多云（夜间）  PARTLY_CLOUDY_NIGHT 
        CLOUDY: 'cloud.fill', // 阴（白天）  CLOUDY 
        CLOUDY_NIGHT: 'cloud.fill', // 阴（夜间）  CLOUDY 
        LIGHT_HAZE: 'sun.haze.fill', // 轻度雾霾   LIGHT_HAZE 
        LIGHT_HAZE_NIGHT: 'sun.haze.fill', // 轻度雾霾   LIGHT_HAZE 
        MODERATE_HAZE: 'sun.haze.fill', // 中度雾霾  MODERATE_HAZE 
        MODERATE_HAZE_NIGHT: 'sun.haze.fill', // 中度雾霾  MODERATE_HAZE 
        HEAVY_HAZE: 'sun.haze.fill', // 重度雾霾   HEAVY_HAZE 
        HEAVY_HAZE_NIGHT: 'sun.haze.fill', // 重度雾霾   HEAVY_HAZE 
        LIGHT_RAIN: 'cloud.drizzle.fill', // 小雨 LIGHT_RAIN 
        MODERATE_RAIN: 'cloud.drizzle.fill', // 中雨 MODERATE_RAIN 
        HEAVY_RAIN: 'cloud.rain.fill', // 大雨  HEAVY_RAIN 
        STORM_RAIN: 'cloud.heavyrain.fill', // 暴雨 STORM_RAIN 
        FOG: 'cloud.fog.fill', // 雾 FOG 
        LIGHT_SNOW: 'cloud.snow.fill', // 小雪  LIGHT_SNOW 
        MODERATE_SNOW: 'cloud.snow.fill', // 中雪 MODERATE_SNOW 
        HEAVY_SNOW: 'cloud.snow.fill', // 大雪  HEAVY_SNOW 
        STORM_SNOW: 'cloud.snow.fill', // 暴雪 STORM_SNOW 
        DUST: 'sun.dust.fill', // 浮尘  DUST 
        SAND: 'smoke.fill', // 沙尘  SAND 
        WIND: 'wind', // 大风  WIND 
    }


    DeviceSize = {
        '428x926': {
            small: { width: 176, height: 176 },
            medium: { width: 374, height: 176 },
            large: { width: 374, height: 391 }
        },
        '390x844': {
            small: { width: 161, height: 161 },
            medium: { width: 342, height: 161 },
            large: { width: 342, height: 359 }
        },
        '414x896': {
            small: { width: 169, height: 169 },
            medium: { width: 360, height: 169 },
            large: { width: 360, height: 376 }
        },
        '375x812': {
            small: { width: 155, height: 155 },
            medium: { width: 329, height: 155 },
            large: { width: 329, height: 345 }
        },
        '414x736': {
            small: { width: 159, height: 159 },
            medium: { width: 348, height: 159 },
            large: { width: 348, height: 357 }
        },
        '375x667': {
            small: { width: 148, height: 148 },
            medium: { width: 322, height: 148 },
            large: { width: 322, height: 324 }
        },
        '320x568': {
            small: { width: 141, height: 141 },
            medium: { width: 291, height: 141 },
            large: { width: 291, height: 299 }
        }
    };

    userConfigData = {
        custom_name: '',
        custom_vehicle_image: null,
        custom_logo_image: null,
        vin: '',
        oilTotal: '',
        bgImageMid: '',
        licensePlate: '',
    };

    addressConfigData = {
        home: '',
        homewaypoints: '',
        company: '',
        companywaypoints: '',
        apiKey: '',
        caiyunKey: ''
    };

    appColorData = {
        light: {
            startColor: DEFAULT_BG_COLOR_LIGHT,
            endColor: DEFAULT_BG_COLOR_DARK,
            fontColor: DEFAULT_BG_COLOR_LIGHT,
            fgColor: DEFAULT_FG_COLOR,
            fgOptical: DEFAULT_FG_COLOR_OPTICAL
        },
        dark: {
            startColor: DEFAULT_BG_COLOR_LIGHT,
            endColor: DEFAULT_BG_COLOR_DARK,
            fontColor: DEFAULT_BG_COLOR_LIGHT,
            fgColor: DEFAULT_FG_COLOR,
            fgOptical: DEFAULT_FG_COLOR_OPTICAL
        }
    };


    constructor(arg) {
        super(arg);
        this.name = 'My BMW';
        this.desc = '宝马互联App小组件';

        // load settings
        this.userConfigData = { ...this.userConfigData, ...this.settings['UserConfig'] };
        this.addressConfigData = { ...this.addressConfigData, ...this.settings['addressConfig'] };
        if (this.addressConfigData.apiKey) {
            MAPAPIKEY = this.addressConfigData.apiKey
        }
        if (this.addressConfigData.caiyunKey) {
            WEATHERKEY = this.addressConfigData.caiyunKey
        }
        let colorSettings = this.settings['AppColorConfig'];
        if (typeof colorSettings == 'string') {
            try {
                colorSettings = JSON.parse(colorSettings);
            } catch (e) {
                colorSettings = {};
            }
        }
        this.appColorData = { ...this.appColorData, ...colorSettings };
        if (this.appColorData.light.fgColor && this.appColorData.light.fgOptical) {
            BACK_COLOR = new Color(this.appColorData.light.fgColor, parseFloat(this.appColorData.light.fgOptical))
        }
        if (config.runsInApp) {
            this.registerAction('帐号设置', this.setWidgetConfig);
            this.registerAction('中组件样式', this.typeSetPickUp);
            this.registerAction('自定义组件', this.userConfigInput);
            this.registerAction('自定义背景', this.colorSetPickUp);
            this.registerAction('自定义导航', this.setAddress);
            this.registerAction('获取当前定位', this.getLocationInfo);
        }
    }

    async getLocationInfo() {
        const location = await this.getLocation()
        const geocode = await Location.reverseGeocode(location.latitude, location.longitude)
        console.log(geocode)
        const geo = geocode[0]
        let address = geo.locality + geo.subLocality
        if (geo.thoroughfare) {
            // 街道
            address += geo.thoroughfare
        }
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '当前经纬度';
        userCustomConfigAlert.message = `${location.longitude.toFixed(6)},${location.latitude.toFixed(6)}\n${address}\n（仅供参考）`
        userCustomConfigAlert.addAction('确定');
        let result = await userCustomConfigAlert.presentAlert();
        if (result == -1) {
            return;
        }
    }

    async getLocation() {
        try {
            const location = await Location.current()
            //调用高德坐标转换，将gps坐标转为火星坐标
            let url = `https://restapi.amap.com/v3/assistant/coordinate/convert?key=${MAPAPIKEY}&coordsys=gps&locations=${location.longitude.toFixed(6)},${location.latitude.toFixed(6)}`
            const data = await this.httpGet(url)
            if (data.info == 'ok') {
                console.log('定位数据请求成功')
                let locations = data.locations.split(',')
                let message = {}
                message.longitude = parseFloat(locations[0])
                message.latitude = parseFloat(locations[1])
                return message;
            }
        } catch (e) {
            console.log('获取坐标转换信息失败')
            console.error(e.message);
        }
    }

    // 透明背景
    async clearBackground() {
        const img = await this.getWidgetScreenShot()
        if (!img) return
        this.setBackgroundImage(img)
    }

    // 移除透明背景
    async removeClearBackground() {
        this.setBackgroundImage(null)
    }

    async setWidgetConfig() {
        await this.getDependencies();
        const confirmationAlert = new Alert();
        Keychain.set(APP_USE_AGREEMENT, 'true');
        await this.userLoginCredentials();
        //await this.colorSetPickUp();
    }

    async userLoginCredentials() {
        const userLoginAlert = new Alert();
        userLoginAlert.title = '配置BMW登录';
        userLoginAlert.message = '配置My BMW账号密码';

        userLoginAlert.addTextField('账号(您的电话)', this.userConfigData['username']);
        userLoginAlert.addSecureTextField('密码(不要有特殊字符)', this.userConfigData['password']);

        userLoginAlert.addAction('确定');
        userLoginAlert.addCancelAction('取消');

        const id = await userLoginAlert.presentAlert();

        if (id == -1) {
            return;
        }

        this.userConfigData['username'] = this.formatUserMobile(userLoginAlert.textFieldValue(0));
        this.userConfigData['password'] = userLoginAlert.textFieldValue(1);

        // try login first
        let loginResult = await this.myBMWLogin();

        if (!loginResult) {
            const messageAlert = new Alert();
            messageAlert.title = '登录失败';
            messageAlert.message = '请检查您的账号密码';
            messageAlert.addCancelAction('取消');
            await messageAlert.presentAlert();

            return this.userLoginCredentials();
        }

        // write to local
        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings();
    }

    formatUserMobile(mobileStr) {
        // remove all non numerical char
        mobileStr = mobileStr.replace(/\D/g, '');

        if (mobileStr.startsWith('86')) {
            return mobileStr;
        }

        if (mobileStr.length == 11) {
            return '86' + mobileStr;
        }

        return mobileStr;
    }

    addFontShadow(text)
    {
        text.shadowColor = new Color('#111111',1)
        text.shadowRadius = 1
        text.shadowOffset = new Point(1,1)
    }

    async getDependencies() {
        const fileManager = FileManager['local']();
        let folder = fileManager.documentsDirectory();

        let libFolder = fileManager.joinPath(folder, 'lib');
        try {
            if (!fileManager.isDirectory(libFolder)) {
                fileManager.createDirectory(libFolder);
            }
        } catch (e) {
            console.error(e.message);
        }

        return await Promise.all(
            DEPENDENCIES.map(async (js) => {
                try {
                    let jsName = js.replace('.js', '');
                    let jsFolder = fileManager.joinPath(libFolder, jsName);

                    // download the file to lib folder
                    let filePath = fileManager.joinPath(jsFolder, 'index.js');
                    let fileExists = fileManager.fileExists(filePath);

                    if (!fileExists) {
                        fileManager.createDirectory(jsFolder);
                        const req = new Request(`${JS_CDN_SERVER}/${encodeURIComponent(js)}`);
                        const res = await req.load();
                        try {
                            fileManager.write(filePath, res);
                            console.warn(js + ' downloaded');
                        } catch (e) {
                            console.error(e.message);
                        }
                    }
                    fileExists = fileManager.fileExists(filePath);
                    if (!fileExists) {
                        this.notify('下载依赖文件失败', '请重新尝试配置');
                    }
                    return console.warn('Dependency found: ' + filePath);
                } catch (e) {
                    console.error(e.message);
                }
            })
        );
    }


    async userConfigInput() {
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '自定义小组件';
        userCustomConfigAlert.message = '以下可以不用填写，留空信息会从系统自动获取';

        // refer to default config
        let configSet = {
            custom_name: '自定义车名（可为空）',
            custom_vehicle_image: '车辆图片URL（可为空）',
            custom_logo_image: 'LOGO URL(可为空）',
            vin: '车架号(多辆BMW时填写)',
            oilTotal: '邮箱容积（可为空）',
            bgImageMid: '背景图（可为空）',
            licensePlate: '车牌号（可为空）',
        };

        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            if (key == 'password') {
                userCustomConfigAlert.addSecureTextField(configSet[key], this.userConfigData[key]);
                continue;
            }
            userCustomConfigAlert.addTextField(configSet[key], this.userConfigData[key]);
        }

        userCustomConfigAlert.addCancelAction('取消');
        userCustomConfigAlert.addAction('确定');

        let result = await userCustomConfigAlert.presentAlert();

        if (result == -1) {
            return;
        }

        // start to get data
        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            let index = Object.keys(configSet).indexOf(key);
            this.userConfigData[key] = userCustomConfigAlert.textFieldValue(index);
        }

        // write to local
        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings();
    }

    async colorSetPickUp() {
        const colorSetPickup = new Alert();

        colorSetPickup.title = '选取背景颜色';
        colorSetPickup.message = `请根据个人喜好选择或者自定义`;

        let systemColorSet = {
            白色: {
                light: {
                    startColor: '#c7c7c7',
                    endColor: '#fff',
                    fontColor: '#1d1d1d',
                    fgColor: '#000000',
                    fgOptical: '0.2'
                },
                dark: {
                    startColor: '#232323',
                    endColor: '#5b5d61',
                    fontColor: '#fff',
                    fgColor: '#000000',
                    fgOptical: '0.2'
                }
            },
            黑色: {
                light: {
                    startColor: '#5e627d',
                    endColor: '#fff',
                    fontColor: '#1d1d1d',
                    fgColor: '#ffffff',
                    fgOptical: '0.2'
                },
                dark: {
                    startColor: '#2d2f40',
                    endColor: '#666878',
                    fontColor: '#fff',
                    fgColor: '#ffffff',
                    fgOptical: '0.2'
                }
            }
        };

        for (const key in systemColorSet) {
            colorSetPickup.addAction(key);
        }
        colorSetPickup.addAction('自定义');
        colorSetPickup.addAction('透明背景')

        colorSetPickup.addAction('移除背景')
        colorSetPickup.addCancelAction('取消')
        const userSelection = await colorSetPickup.presentAlert();

        if (userSelection == 2) {
            this.settings['AppColorConfig'] = await this.colorConfigInput();
        }
        else if (userSelection == 3) {
            this.clearBackground()
        }
        else if (userSelection == 4) {
            this.removeClearBackground()
        }
        else {
            for (const key in systemColorSet) {
                if (!systemColorSet[key]) {
                    continue;
                }
                let index = Object.keys(systemColorSet).indexOf(key);
                if (index == userSelection) {
                    this.settings['AppColorConfig'] = systemColorSet[key];
                }
            }
        }
        // write to local
        this.saveSettings();
    }

    async typeSetPickUp() {
        const typeSetPickUp = new Alert();
        typeSetPickUp.title = '选取中组件样式';
        typeSetPickUp.message = `挑选中组件样式，也可复制出一份代码，将两种样式同时添加到桌面。\n小技巧：两个中组件在桌面还可以叠放显示哦|`;
        typeSetPickUp.addAction('车型信息&续航里程');
        typeSetPickUp.addAction('车辆定位&天气导航');
        typeSetPickUp.addCancelAction('取消');
        const userSelection = await typeSetPickUp.presentAlert();
        this.settings['TypeConfig'] = userSelection
        this.saveSettings();
    }

    async colorConfigInput() {
        const bgColorAlert = new Alert();
        bgColorAlert.title = '配置颜色';
        bgColorAlert.message = '请输入16进制RBG颜色代码, 留空小组件将自动从系统获取';
        bgColorAlert.addTextField('背景颜色1（如#FFFFFF）', this.appColorData['light']['startColor']);
        bgColorAlert.addTextField('背景颜色2（如#FFFFFF）', this.appColorData['light']['endColor']);
        bgColorAlert.addTextField('字体颜色（如#000000）', this.appColorData['light']['fontColor']);
        bgColorAlert.addTextField('遮罩颜色（如#000000）', this.appColorData['light']['fgColor']);
        bgColorAlert.addTextField('遮罩透明度（如0.1）', this.appColorData['light']['fgOptical']);
        bgColorAlert.addAction('确定');
        bgColorAlert.addCancelAction('取消');
        const id = await bgColorAlert.presentAlert();
        if (id == -1) {
            return this.appColorData;
        }

        let appColorConfig = {
            startColor: bgColorAlert.textFieldValue(0),
            endColor: bgColorAlert.textFieldValue(1),
            fontColor: bgColorAlert.textFieldValue(2),
            fgColor: bgColorAlert.textFieldValue(3),
            fgOptical: bgColorAlert.textFieldValue(4),
        };
        return { light: appColorConfig, dark: appColorConfig };
    }

    async setAddress() {
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '自定义导航';
        userCustomConfigAlert.message = '经纬度格式\n111.123456,22.123456\n中间使用英文逗号分隔\n填写个人秘钥，可以防止接口配额超限问题。';

        // refer to default config
        let addressConfigSet = {
            home: '住宅的经纬度',
            homewaypoints: '回家途经点（可为空）',
            company: '公司的经纬度（可为空）',
            companywaypoints: '去公司途经点（可为空）',
            apiKey: '高德Web服务API秘钥（可为空）',
            caiyunKey: '彩云天气API秘钥（可为空）'
        };
        for (const key in addressConfigSet) {
            if (!addressConfigSet[key] || !this.addressConfigData.hasOwnProperty(key)) {
                continue;
            }
            userCustomConfigAlert.addTextField(addressConfigSet[key], this.addressConfigData[key]);
        }
        userCustomConfigAlert.addCancelAction('取消');
        userCustomConfigAlert.addAction('确定');
        let result = await userCustomConfigAlert.presentAlert();
        if (result == -1) {
            return;
        }

        // start to get data
        for (const key in addressConfigSet) {
            if (!addressConfigSet[key] || !this.addressConfigData.hasOwnProperty(key)) {
                continue;
            }

            let index = Object.keys(addressConfigSet).indexOf(key);
            this.addressConfigData[key] = userCustomConfigAlert.textFieldValue(index);
        }

        // write to local
        this.settings['addressConfig'] = this.addressConfigData;
        this.saveSettings();
    }

    async getAppLogo() {
        let logoURL = DEFAULT_LOGO_LIGHT;

        if (this.userConfigData.custom_logo_image) {
            logoURL = this.userConfigData.custom_logo_image;
        }
        let image = await this.getImageByUrl(logoURL)
        return image
    }

    async renderError(errMsg) {
        let w = new ListWidget();
        w.backgroundGradient = this.getBackgroundColor();

        const padding = 16;
        w.setPadding(padding, padding, padding, padding);
        w.addStack().addText(errMsg);
        return w;
    }

    getFontColor() {
        if (this.validColorString(this.appColorData.light.fontColor)) {
            return Color.dynamic(
                new Color(this.appColorData['light']['fontColor'], 1),
                new Color(this.appColorData['dark']['fontColor'], 1)
            );
        }
        return Color.dynamic(new Color('#2B2B2B', 1), Color.white());
    }

    getBackgroundColor() {
        const bgColor = new LinearGradient();
        let startColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));
        let endColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));
        try {
            // if user override
            if (
                this.appColorData.light.startColor != DEFAULT_BG_COLOR_LIGHT ||
                this.appColorData.light.endColor != DEFAULT_BG_COLOR_LIGHT
            ) {
                if (
                    this.validColorString(this.appColorData['light'].startColor) &&
                    this.validColorString(this.appColorData['light'].endColor)
                ) {
                    startColor = Color.dynamic(
                        new Color(this.appColorData['light']['startColor'], 1),
                        new Color(this.appColorData['dark']['startColor'], 1)
                    );

                    endColor = Color.dynamic(
                        new Color(this.appColorData['light']['endColor'], 1),
                        new Color(this.appColorData['dark']['endColor'], 1)
                    );
                }
            }
        } catch (e) {
            console.error(e.message);
        }

        bgColor.colors = [startColor, endColor];

        bgColor.locations = [0.0, 1.0];
        bgColor.startPoint = new Point(1, 0.5)
        bgColor.endPoint = new Point(0, 0)
        return bgColor;
    }

    validColorString(colorStr) {
        return colorStr && colorStr.search('#') == 0 && (colorStr.length == 4 || colorStr.length == 7); // TODO: change to regex
    }

    provideFont(fontName, fontSize) {
        const fontGenerator = {
            'ultralight': function () {
                return Font.ultraLightSystemFont(fontSize)
            },
            'light': function () { return Font.lightSystemFont(fontSize) },
            'regular': function () { return Font.regularSystemFont(fontSize) },
            'medium': function () { return Font.mediumSystemFont(fontSize) },
            'semibold': function () { return Font.semiboldSystemFont(fontSize) },
            'bold': function () { return Font.boldSystemFont(fontSize) },
            'heavy': function () { return Font.heavySystemFont(fontSize) },
            'black': function () { return Font.blackSystemFont(fontSize) },
            'italic': function () { return Font.italicSystemFont(fontSize) },
        }
        const systemFont = fontGenerator[fontName]
        if (systemFont) { return systemFont() }
        return new Font(fontName, fontSize)
    }

    getOilPercent(data) {
        if (data.status.fuelIndicators.length === 1 && data.status.fuelIndicators[0].showsBar) {
            return data.status.fuelIndicators[0].mainBarValue
        } else {
            let current = data.status.fuelIndicators[0].levelValue
            let all = this.userConfigData.oilTotal === '' ? 65 : parseInt(this.userConfigData.oilTotal)
            if (this.userConfigData.oilTotal === '') {
                console.log('非id7车辆需要设置油箱容积，默认容积65L')
            }
            return parseInt(current * 100 / all)
        }
    }

    getControlMessages(data) {
        try {
            let checkControlMessages = data.status.checkControlMessages.filter((checkControlMessage) => {
                return checkControlMessage['criticalness'] != 'nonCritical';
            });
            if (data.status.issues) {
                for (const key in data.status.issues) {
                    if (!data.status.issues[key]) {
                        continue;
                    }
                    if (data.status.issues[key]['title']) {
                        checkControlMessages.push(data.status.issues[key]);
                    }
                }
            }
            return checkControlMessages;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async getCarCanvasImage(data, canvasWidth, canvasHeight) {

        let canvas = new DrawContext();
        canvas.size = new Size(canvasWidth, canvasHeight);
        canvas.opaque = false;
        canvas.setFont(this.provideFont('heavy', Math.round(canvasHeight / 4.5)));
        canvas.setTextColor(this.getFontColor());
        canvas.respectScreenScale = true;

        try {
            let checkControlMessages = this.getControlMessages(data);
            if (checkControlMessages && checkControlMessages.length == 0) {
                canvas.drawTextInRect(
                    'ALL',
                    new Rect(
                        canvasWidth * 0.05, //
                        0,
                        Math.round(canvasWidth * 0.5),
                        Math.round(canvasWidth * 0.5)
                    )
                );
                canvas.drawTextInRect(
                    'GOOD',
                    new Rect(
                        canvasWidth * 0.05,
                        Math.round(canvasHeight / 4.5),
                        Math.round(canvasWidth * 0.5),
                        Math.round(canvasWidth * 0.5)
                    )
                );
            } else {
                let messageFontSize = Math.round(canvasHeight / 8);
                let messageOffset = 0
                let exclamation = SFSymbol.named('exclamationmark.circle').image;
                exclamation.tintColor = new Color("#ff0000", 1)
                canvas.drawImageInRect(
                    exclamation,
                    new Rect(3, messageOffset, Math.round(messageFontSize * 1.2), Math.round(messageFontSize * 1.2))
                );
                canvas.setFont(this.provideFont("bold", messageFontSize));
                canvas.setTextColor(new Color("#ff0000", 1));
                for (const checkControlMessage of checkControlMessages) {
                    canvas.drawTextInRect(
                        checkControlMessage.title,
                        new Rect(
                            Math.round(messageFontSize * 1.8),
                            messageOffset,
                            Math.round(canvasWidth * 0.5),
                            Math.round(canvasWidth * 0.5)
                        )
                    );
                    messageOffset = messageOffset + messageFontSize;
                }
            }
        } catch (e) {
            console.warn(e.message);
        }
        let carImage = await this.getVehicleImage(data);
        let imageSize = this.getImageSize(
            carImage.size.width,
            carImage.size.height,
            canvasWidth,
            canvasHeight
        );

        console.warn('rate ' + imageSize.width / imageSize.height);
        console.warn('imageSize ' + JSON.stringify(imageSize));
        canvas.drawImageInRect(
            carImage,
            new Rect(
               ( canvasWidth - imageSize.width)/2,
                canvasHeight - imageSize.height,
                imageSize.width,
                imageSize.height
            )
        );
        return canvas.getImage();
    }

    getImageSize(imageWidth, imageHeight, canvasWidth, canvasHeight, resizeRate = 0.99) {
        let a = canvasWidth;
        let b = canvasWidth / imageWidth * imageHeight;
        console.log('imageWidth:' + a + ',imageHeight:' + b)
        console.log('canvasWidth:' + canvasWidth + ',canvasHeight:' + canvasHeight)
        if (resizeRate >= 1) {
            resizeRate = 0.99;
        }
        while (true) {
            if (a >= canvasWidth || b >= canvasHeight) {
                console.warn(`resizeRate:${resizeRate}`);
                a = resizeRate * a;
                b = resizeRate * b;
            }
            else {
                break;
            }
        }
        return { width: a, height: b };
    }


    //地图
    async loadMapView(latLng, width, height) {
        try {
            width = parseInt(width * 1.5);
            height = parseInt(height * 1.5);
            let url = `https://restapi.amap.com/v3/staticmap?location=${latLng}&scale=2&zoom=14&size=${width}*${height}&traffic=1&markers=large,0x0099FF,:${latLng}&key=${MAPAPIKEY}`;
            const img = await this.getImageByUrl(url, false)
            return img;
        } catch (e) {
            console.log('load map failed');
            console.error(e.message);
            let ctx = new DrawContext();
            ctx.size = new Size(width, height);
            ctx.fillRect(new Rect(0, 0, width, height));
            ctx.drawTextInRect(e.message || '获取地图失败', new Rect(20, 20, width, height));
            return await ctx.getImage();
        }
    }

    getFuelIndicators(fuelIndicators) {
        let _fuelObj = {
            levelValue: null,
            levelUnits: null,
            rangeValue: null,
            rangeUnits: null,
            chargingType: null
        };
        try {
            for (const fuelIndicator of fuelIndicators) {
                for (const key in _fuelObj) {
                    if (fuelIndicator[key] && !_fuelObj[key]) {
                        _fuelObj[key] = fuelIndicator[key];
                    }
                }
            }

            for (const key in _fuelObj) {
                if (!_fuelObj[key]) {
                    _fuelObj[key] = '';
                }
            }
        } catch (e) { }

        return _fuelObj;
    }

    buildMapURL(lon, lat, name) {
        return `iosamap://path?sourceApplication=applicationName&poiname=${encodeURI(name)}&dlat=${lat}&dlon=${lon}&dev=0&t=0`
    }

    formatDate(data = null) {
        let lastUpdated = new Date();
        if (data != null) {
            lastUpdated = new Date(data.status.lastUpdatedAt);
        }
        let formatter = 'HH:mm';
        let dateFormatter = new DateFormatter();
        dateFormatter.dateFormat = formatter;

        let dateStr = dateFormatter.string(lastUpdated);
        return `${dateStr}`;
    }

    async getData() {
        let accessToken = await this.getAccessToken();
        if (!accessToken || accessToken == '') {
            return null;
        }

        try {
            await this.checkInDaily(accessToken);
        } catch (e) {
            console.error(e.message);
        }
        return await this.getVehicleDetails(accessToken);
    }

    async getPublicKey() {
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/cop/publickey'
        const res = await this.httpGet(req)
        if (res.code == 200 && res.data.value) {
            console.log('Getting public key success');
            return res.data.value;
        } else {
            console.log('Getting public key failed');
            return '';
        }
    }

    async getAccessToken() {
        let accessToken = '';
        if (Keychain.contains(MY_BMW_TOKEN_UPDATE_LAST_AT)) {
            let lastUpdate = parseInt(Keychain.get(MY_BMW_TOKEN_UPDATE_LAST_AT));
            if (lastUpdate > new Date().valueOf() - 1000 * 60 * 50) {
                if (Keychain.contains(MY_BMW_TOKEN)) {
                    accessToken = Keychain.get(MY_BMW_TOKEN);
                }
            } else {
                if (Keychain.contains(MY_BMW_REFRESH_TOKEN)) {
                    let refreshToken = Keychain.get(MY_BMW_REFRESH_TOKEN);
                    // get refresh token
                    accessToken = await this.refreshToken(refreshToken);
                }
            }
        }

        if (accessToken && accessToken != '') {
            return accessToken;
        }

        console.log('No token found, get again');
        const res = await this.myBMWLogin();

        if (res) {
            const { access_token, refresh_token } = res;

            accessToken = access_token;
            try {
                Keychain.set(MY_BMW_TOKEN_UPDATE_LAST_AT, String(new Date().valueOf()));
                Keychain.set(MY_BMW_TOKEN, accessToken);
                Keychain.set(MY_BMW_REFRESH_TOKEN, refresh_token);
            } catch (e) {
                console.error(e.message);
            }
        } else {
            accessToken = '';
        }

        return accessToken;
    }

    async myBMWLogin() {
        console.log('Start to get token');
        const _password = await this.getEncryptedPassword();
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/login/pwd';
        let body = JSON.stringify({
            mobile: this.userConfigData.username,
            password: _password
        });
        let headers = BMW_HEADERS;
        console.log('trying to login');
        const res = await this.httpPost(req, headers, body)
        if (res.code == 200) {
            return res.data;
        } else {
            console.log('Get token error');
            return null;
        }
    }

    async getEncryptedPassword() {
        let publicKey = await this.getPublicKey();

        try {
            // 感谢沙包大佬提供思路
            let JSEncrypt = importModule(`lib/jsencrypt`);

            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);

            return encrypt.encrypt(this.userConfigData.password);
        } catch (e) {
            console.error(' error ' + e.message);
            return null;
        }
    }

    async refreshToken(refresh_token) {
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/oauth/token'
        let headers = {
            ...BMW_HEADERS,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        let body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
        const res = await this.httpPost(req, headers, body)
        if (res.access_token !== undefined) {
            const { access_token, refresh_token } = res;
            Keychain.set(MY_BMW_TOKEN, access_token);
            Keychain.set(MY_BMW_REFRESH_TOKEN, refresh_token);
            Keychain.set(MY_BMW_TOKEN_UPDATE_LAST_AT, String(new Date().valueOf()));
            return access_token;
        } else {
            return '';
        }
    }

    async getVehicleDetails(access_token) {
        let vin = this.userConfigData.vin || '';

        let lastUpdateKey = vin + MY_BMW_VEHICLE_UPDATE_LAST_AT;
        let localVehicleDataKey = vin + MY_BMW_VEHICLE_DATA;

        // skip update prevent access to bmw too much
        let cachedVehicleData
        try {
            if (Keychain.contains(lastUpdateKey) && Keychain.contains(localVehicleDataKey)) {
                let lastUpdate = parseInt(Keychain.get(lastUpdateKey));

                cachedVehicleData = JSON.parse(Keychain.get(localVehicleDataKey));

                // load data every 5 mins
                if (lastUpdate > new Date().valueOf() - 1000 * 60 * 1 && cachedVehicleData && cachedVehicleData.vin) {
                    console.log('Get vehicle data from cache');

                    return cachedVehicleData;
                }
            }
        } catch (e) {
            console.warn('Load vehicle from cache failed');
        }

        console.log('Start to get vehicle details online');
        let req = BMW_SERVER_HOST + `/eadrax-vcs/v1/vehicles?appDateTime=${new Date().valueOf()}`;

        let headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + access_token,
            'content-type': 'application/json; charset=utf-8'
        };

        const vehicles = await this.httpGet(req, headers)

        if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
            let vehicleData = null;

            console.log('Get vehicle details success');
            if (vin && vin.length > 0) {
                // if more than one vehicle
                let vehicleFound = vehicles.find((vehicle) => {
                    return vehicle.vin && vehicle.vin.toUpperCase() == vin.toUpperCase();
                });

                if (vehicleFound) {
                    console.log('VIN matched and found: ' + vin);

                    vehicleData = vehicleFound;
                }
            }

            vehicleData = vehicleData || vehicles[0];

            Keychain.set(lastUpdateKey, String(new Date().valueOf()));
            Keychain.set(localVehicleDataKey, JSON.stringify(vehicleData));

            return vehicleData;
        }

        console.error('Load vehicle failed');
        return cachedVehicleData;
    }

    async checkInDaily(access_token) {
        let dateFormatter = new DateFormatter();
        const lastCheckIn = Keychain.contains(MY_BMW_LAST_CHECK_IN_AT) ? Keychain.get(MY_BMW_LAST_CHECK_IN_AT) : null;

        dateFormatter.dateFormat = 'yyyy-MM-dd';
        let today = dateFormatter.string(new Date());

        if (Keychain.contains(MY_BMW_LAST_CHECK_IN_AT)) {
            console.log('last checked in at: ' + lastCheckIn);

            if (lastCheckIn == today) {
                console.log('User has checked in today');

                return;
            }
        }

        console.log('Start check in');
        let req = BMW_SERVER_HOST + '/cis/eadrax-community/private-api/v1/mine/check-in';
        let headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + access_token,
            'content-type': 'application/json; charset=utf-8'
        };


        let body = JSON.stringify({ signDate: null });

        const res = await this.httpPost(req, headers, body)

        if (Number(res.code) >= 200 && Number(res.code) <= 300) {
            Keychain.set(MY_BMW_LAST_CHECK_IN_AT, today);
        }

        let msg = `${res.message || ''}`;

        if (res.code != 200) {
            msg += `: ${res.businessCode || ''}, 上次签到: ${lastCheckIn || 'None'}.`;
        }

        this.notify('My BMW签到', msg);
    }

    async getBmwOfficialImage(url, useCache = true) {
        const cacheKey = this.md5(url);
        const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);

        if (useCache && FileManager.local().fileExists(cacheFile)) {
            return Image.fromFile(cacheFile);
        }

        try {
            let access_token = '';
            if (Keychain.contains(MY_BMW_TOKEN)) {
                access_token = Keychain.get(MY_BMW_TOKEN);
            } else {
                throw new Error('没有token');
            }

            let headers = {
                ...BMW_HEADERS,
                authorization: 'Bearer ' + access_token
            };

            const img = await this.getImageByUrl(url, headers)

            // 存储到缓存
            FileManager.local().writeImage(cacheFile, img);
            return img;
        } catch (e) {
            let ctx = new DrawContext();
            ctx.size = new Size(100, 100);
            ctx.setFillColor(new Color('#eee', 1));
            ctx.drawTextInRect(e.message || '获取车辆图片失败', new Rect(20, 20, 100, 100));
            ctx.fillRect(new Rect(0, 0, 100, 100));
            return await ctx.getImage();
        }
    }

    async getVehicleImage(data) {
        let imageCar = '';
        let carImageUrl =
            BMW_SERVER_HOST + `/eadrax-ics/v3/presentation/vehicles/${data.vin}/images?carView=VehicleStatus`;
        if (this.userConfigData.custom_vehicle_image) {
            imageCar = await this.getImageByUrl(this.userConfigData.custom_vehicle_image);
        } else {
            imageCar = await this.getBmwOfficialImage(carImageUrl);
        }
        return imageCar;
    }

    async getPath(slon, slat, dlon, dlat, plate, waypoints = '') {
        try {
            let url = `https://restapi.amap.com/v5/direction/driving?origin=${slon},${slat}&destination=${dlon},${dlat}&plate=${encodeURI(plate)}&key=${MAPAPIKEY}&show_fields=cost`
            if (waypoints != '') {
                url += `&waypoints=${waypoints}`
            }
            console.log(url)
            const res = await this.httpGet(url)
            return res;
        } catch (e) {
            console.log('获取导航信息失败')
            console.error(e.message);
        }
    }

    async getWeather(lon, lat) {
        try {
            let url = `https://api.caiyunapp.com/v2.5/${WEATHERKEY}/${lon},${lat}/weather.json?alert=true`
            console.log(url)
            const weatherJsonData = await this.httpGet(url)
            if (weatherJsonData.status == 'ok') {
                log('天气数据请求成功')
                let weatherInfo = {}
                // 天气突发预警
                let alertWeather = weatherJsonData.result.alert.content
                if (alertWeather.length > 0) {
                    const alertWeatherTitle = alertWeather[0].title
                    log(`突发的天气预警==>${alertWeatherTitle}`)
                    weatherInfo.alertWeatherTitle = alertWeatherTitle
                }
                // 温度范围
                const temperatureData = weatherJsonData.result.daily.temperature[0]
                // 最低温度
                const minTemperature = temperatureData.min
                // 最高温度
                const maxTemperature = temperatureData.max
                weatherInfo.minTemperature = Math.round(minTemperature)
                weatherInfo.maxTemperature = Math.round(maxTemperature)
                // 实时温度
                const temperature = weatherJsonData.result.realtime.temperature
                weatherInfo.temperature = Math.floor(temperature)
                //天气预告
                const weatherDesc = weatherJsonData.result.forecast_keypoint
                weatherInfo.weatherDesc = weatherDesc.replace('。还在加班么？', '，')
                // 天气状况 weatherIcos[weatherIco]
                let weather = weatherJsonData.result.realtime.skycon
                // 小时
                const hour = new Date().getHours()
                let night = hour < 6 || hour >= 18
                let nightCloudy = night && weather == 'CLOUDY'
                let nightLightHaze = night && weather == 'LIGHT_HAZE'
                let nightModerateHaze = night && weather == 'MODERATE_HAZE'
                let nightHeavyHaze = night && weather == 'HEAVY_HAZE'
                if (nightCloudy) {
                    weather = 'CLOUDY_NIGHT'
                }
                if (nightLightHaze) {
                    weather = 'LIGHT_HAZE_NIGHT'
                }
                if (nightModerateHaze) {
                    weather = 'MODERATE_HAZE_NIGHT'
                }
                if (nightHeavyHaze) {
                    weather = 'HEAVY_HAZE_NIGHT'
                }
                weatherInfo.weatherIco = weather
                // 降水率
                weatherInfo.probability = Math.floor(weatherJsonData.result.minutely.probability[0] * 100)
                return weatherInfo;
            }
        } catch (e) {
            console.log('获取彩云天气信息失败')
            console.error(e.message);
        }
    }
}
// @组件代码结束

const { Testing } = require('./开发环境');
await Testing(Widget);