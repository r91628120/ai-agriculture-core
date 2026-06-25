/*
========================================
AI Agriculture Core
App.js v1.0

AI Agriculture App Controller

整個平台唯一入口
========================================
*/

class AIAgricultureApp{

    constructor(){

        console.log("AI Agriculture Core v1.0");

        this.weatherAPI = null;

        this.stationService = null;

        this.weatherEngine = null;

        this.weatherFusion = null;

    }

    /*
    ----------------------------
    初始化
    ----------------------------
    */

    async init(config){

        console.log("Initializing Core...");

        // API

        this.weatherAPI =
            new WeatherAPI(
                config.weatherApi
            );

        // 測站

        this.stationService =
            await StationService.load(
                config.stationJson
            );

        // 融合

        this.weatherFusion =
            new WeatherFusionEngine();

        // Weather

        this.weatherEngine =
            new WeatherEngine(

                this.weatherAPI,

                this.weatherFusion

            );

        console.log("Core Ready");

    }

    /*
    ----------------------------
    取得融合氣象
    ----------------------------
    */

    async getFusionWeather(lat,lng){

        const stations =

            this.stationService
            .findNearestStations(
                lat,
                lng,
                3
            );

        return await this.weatherEngine
            .getFusionWeather(
                stations
            );

    }

}

window.AIAgricultureApp =
    AIAgricultureApp;