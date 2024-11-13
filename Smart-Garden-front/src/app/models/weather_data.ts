export interface WeatherApiData {
    minTemperature: number | null ;
    maxTemperature: number | null;
    description: string | null;
    uvindex: number | null;
    windspeed: number | null;
    risk : string | null;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9;
}

export function convertMphToKmph(mph : number) : number {
    return (mph * 1.60934);
}

export function determineSevereRiskOfCatastrophe(risk : number) : string{
    if (risk < 30) return 'L';
    if (risk >= 30 && risk <70) return 'M';
    if (risk >= 70) return 'H';
    // default
    return 'D';
}
