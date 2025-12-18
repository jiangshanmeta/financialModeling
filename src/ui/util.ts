import { KILO, MM } from "../model/constant";
import type { Scenario } from "../model/scenarios";

const ScenarioTextMap: Record<Scenario, string> = {
    base: "Base Case",
    best: "Best Case",
    worst: "Worst Case"
}
const withNegative = (fn:(n:number)=>string )=>{
    return (n:number)=>{
        if(n<0){
            return `(${fn(-n)})`
        }
        return fn(n);
    }
}
export const getScenarioText = (scenarios: Scenario) => {
    return ScenarioTextMap[scenarios]
}

export const formatPercent = (num:number)=>{
    return `${(num*100).toFixed(1)}%`
}

export const formatDecimal = withNegative((num:number, decimals = 1)=> {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
})

export const formatKILO = withNegative((number:number,decimals = 1)=>{
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number/KILO)
})

export const formatMM = withNegative((number:number,decimals = 1)=>{
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number/MM)
})



