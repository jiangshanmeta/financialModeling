import { KILO, MM } from "../model/constant";
import type { Scenario } from "../model/scenarios";

const ScenarioTextMap: Record<Scenario, string> = {
    base: "Base Case",
    best: "Best Case",
    worst: "Worst Case"
}

export const getScenarioText = (scenarios: Scenario) => {
    return ScenarioTextMap[scenarios]
}

export const formatPercent = (num:number)=>{
    return `${(num*100).toFixed(1)}%`
}

export const formatDecimal = (num:number, decimals = 1)=> {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

export const formatKILO = (number:number,decimals = 1)=>{
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number/KILO)
}

export const formatMM = (number:number,decimals = 1)=>{
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number/MM)
}

