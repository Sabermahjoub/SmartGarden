export interface plant {
    plant_name : string,
    minTemp_day : number,
    maxTemp_day : number,    
    minTemp_night : number,
    maxTemp_night : number,
    minHumidity : number,
    maxHumidity: number,
    Wind : string, // Low, Moderate, High
    minUVIndex : number,
    maxUvIndex : number,
    minLight : number,
    maxLight : number,
    minSoilMoisture : number,
    maxSoilMoisture : number
}