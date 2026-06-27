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

        this.cropEngine = null;

        this.decisionEngine = null;

        this.diseaseEngine = null;

        this.promptEngine = null;
        
        this.dashboard = null;
        


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

        this.cropEngine =
             await CropEngine.load(
            config.cropJson || "data/crops.json"
            );

           // Decision
        this.decisionEngine =
        new DecisionEngine();

        this.diseaseEngine =
           await DiseaseEngine.load(
           config.diseaseJson || "data/diseases.json"
           );

        this.promptEngine = new PromptEngine(); 
  
        this.dashboard =
        new WeatherDashboardModule();
        

       



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

    getCrop(cropName) {
    return this.cropEngine.findCrop(cropName);
    }

    getCropSummary(cropName, stage = "") {
    return this.cropEngine.summarizeCrop(cropName, stage);
    }

    getCropRisks(cropName, stage = "") {
    return this.cropEngine.getSensitiveRisks(cropName, stage);
    }

    getCropDiseases(cropName) {
    return this.cropEngine.getCommonDiseases(cropName);
    }
    
    analyzeDisease({ cropName, stage = "", weather }) {
    return this.diseaseEngine.evaluate({
        cropName,
        stage,
        weather
    });
}

    analyzeDecision({ cropName, stage = "", weather, diseaseRisk = null }) {

    const crop =
        this.getCropSummary(
            cropName,
            stage
        );

    return this.decisionEngine.analyze({
        crop,
        stage,
        weather,
        diseaseRisk
    });

}

   analyzeDiseaseDecision({ cropName, stage = "", weather }) {

    const diseaseRisk =
        this.analyzeDisease({
            cropName,
            stage,
            weather
        });

    const decision =
        this.analyzeDecision({
            cropName,
            stage,
            weather,
            diseaseRisk
        });

    return {
        success: true,
        cropName,
        stage,
        weather,
        diseaseRisk,
        decision
    };
}

    buildWeatherCoachPrompt(data) {

    return this.promptEngine.buildWeatherCoachPrompt(data);

}


async analyze({
    cropName,
    stage = "",
    lat,
    lng,
    county = "",
    township = ""
}) {

    if (!cropName) {
        return {
            success: false,
            message: "AIAKOS.analyze：缺少 cropName"
        };
    }

    if (!lat || !lng) {
        return {
            success: false,
            message: "AIAKOS.analyze：缺少 lat / lng"
        };
    }

    const fusionResult =
        await this.getFusionWeather(
            lat,
            lng
        );

    if (!fusionResult || fusionResult.success !== true) {
        return {
            success: false,
            message: "無法取得融合氣象資料",
            fusionResult
        };
    }

    const weather =
        fusionResult.fusion?.fused || {};

    const diseaseDecision =
        this.analyzeDiseaseDecision({
            cropName,
            stage,
            weather
        });

    const prompt =
        this.buildWeatherCoachPrompt({
            cropName,
            stage,
            location: `${county}${township}`,
            weather,
            diseaseRisk: diseaseDecision.diseaseRisk,
            decision: diseaseDecision.decision
        });

    return {
        success: true,
        cropName,
        stage,
        location: {
            county,
            township,
            lat,
            lng
        },
        weather,
        fusion: fusionResult.fusion,
        diseaseRisk: diseaseDecision.diseaseRisk,
        decision: diseaseDecision.decision,
        prompt
    };
}

render(result) {

    if (!this.dashboard) {
        console.warn("AIAKOS.render：尚未初始化 WeatherDashboardModule");
        return;
    }

    this.dashboard.render(result);

}






}

window.AIAgricultureApp =
    AIAgricultureApp;