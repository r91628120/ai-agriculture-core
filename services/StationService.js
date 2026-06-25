/*
========================================
AI Agriculture Core
StationService.js v1.0
最近測站 / 最近三站 / 距離計算服務
========================================
*/

class StationService {
  constructor(stations = []) {
    this.stations = stations;
  }

  static async load(jsonPath = "../data/stations.json") {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error("StationService：無法讀取 stations.json");
    }

    const stations = await response.json();
    return new StationService(stations);
  }

  getAllStations() {
    return this.stations || [];
  }

  findById(stationId) {
    return this.stations.find(station =>
      station.id === stationId ||
      station.stationId === stationId ||
      station.code === stationId
    ) || null;
  }

  findNearestStation(lat, lng) {
    const nearest = this.findNearestStations(lat, lng, 1);
    return nearest.length > 0 ? nearest[0] : null;
  }

  findNearestStations(lat, lng, limit = 3) {
    if (!lat || !lng) {
      throw new Error("StationService：缺少經緯度");
    }

    return this.stations
      .filter(station => station.lat && station.lng)
      .map(station => {
        const distance = this.calculateDistance(
          Number(lat),
          Number(lng),
          Number(station.lat),
          Number(station.lng)
        );

        return {
          ...station,
          distanceKm: Number(distance.toFixed(2))
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);
  }

  findByTownship(county, township) {
    return this.stations.filter(station =>
      station.county === county &&
      station.township === township
    );
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;

    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }
}

window.StationService = StationService;