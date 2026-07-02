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
        
        this.analysisModule = null;

        this.eventBus = null;


    }

    /*
    ----------------------------
    初始化
    ----------------------------
    */

    async init(config){

        console.log("Initializing Core...");

        this.eventBus = new EventBus();

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

        this.dashboard.bindEventBus(
        this.eventBus
        );

        
        
        this.analysisModule = new AnalysisModule();
       
        this.analysisModule.bindEventBus(
        this.eventBus
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

/*
----------------------------
AIAKOS Controller Layer v2.0
農場決策分析統一入口
----------------------------
*/

async analyzeFarmDecision(input = {}) {

    try {

        if (!input || typeof input !== "object") {
            throw new Error("analyzeFarmDecision：輸入資料必須是物件格式");
        }

        const {
            cropName,
            stage = "",
            lat,
            lng,
            county = "",
            township = ""
        } = input;

        if (!cropName) {
            throw new Error("analyzeFarmDecision：缺少 cropName");
        }

        if (!lat || !lng) {
            throw new Error("analyzeFarmDecision：缺少 lat / lng");
        }

        const result =
            await this.analyze({
                cropName,
                stage,
                lat,
                lng,
                county,
                township
            });

         this.eventBus.emit("analysis:completed", {
              input,
              result
        });


        return {
            success: true,
            source: "AIAKOS Controller Layer",
            controller: "analyzeFarmDecision",
            version: "v2.0",
            input,
            result,
            timestamp: new Date().toISOString()
        };

    } catch (error) {

        console.error(
            "[AIAKOS] analyzeFarmDecision error:",
            error
        );

        return {
            success: false,
            source: "AIAKOS Controller Layer",
            controller: "analyzeFarmDecision",
            version: "v2.0",
            input,
            error: error.message,
            timestamp: new Date().toISOString()
        };

    }

}

render(result) {

    if (!this.dashboard) {
        console.warn("AIAKOS.render：尚未初始化 WeatherDashboardModule");
        return;
    }

    this.dashboard.render(result);

}

buildAnalysis(result) {
    return this.analysisModule.build(result);
}

analysisToJSON(result) {
    return this.analysisModule.toJSON(result);
}







}

window.AIAgricultureApp =
    AIAgricultureApp;