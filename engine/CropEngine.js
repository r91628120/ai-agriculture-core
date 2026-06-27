/*
========================================
AI Agriculture Core
CropEngine.js v1.0
作物核心引擎
========================================
*/

class CropEngine {
  constructor(crops = []) {
    this.crops = crops;
  }

  static async load(jsonPath = "data/crops.json") {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error("CropEngine：無法讀取 crops.json");
    }

    const crops = await response.json();
    return new CropEngine(crops);
  }

  findCrop(inputName) {
    if (!inputName) return null;

    const keyword = inputName.trim();

    return this.crops.find(crop => {
      return (
        crop.name === keyword ||
        crop.id === keyword ||
        (Array.isArray(crop.aliases) && crop.aliases.includes(keyword))
      );
    }) || null;
  }

  getIdealRange(cropName) {
    const crop = this.findCrop(cropName);
    if (!crop) return null;

    return {
      temp: crop.idealTemp || null,
      humidity: crop.idealHumidity || null
    };
  }

  getSensitiveRisks(cropName, stage) {
    const crop = this.findCrop(cropName);
    if (!crop || !crop.sensitiveStages) return [];

    return crop.sensitiveStages[stage] || [];
  }

  getCommonDiseases(cropName) {
    const crop = this.findCrop(cropName);
    return crop?.commonDiseases || [];
  }

  summarizeCrop(cropName, stage = "") {
    const crop = this.findCrop(cropName);

    if (!crop) {
      return {
        found: false,
        message: `找不到「${cropName}」的作物資料。`
      };
    }

    return {
      found: true,
      id: crop.id,
      name: crop.name,
      category: crop.category,
      idealTemp: crop.idealTemp,
      idealHumidity: crop.idealHumidity,
      stageRisks: stage ? this.getSensitiveRisks(crop.name, stage) : [],
      commonDiseases: crop.commonDiseases || [],
      notes: crop.weatherNotes || ""
    };
  }
}

window.CropEngine = CropEngine;