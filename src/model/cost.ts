import type { CostInflationScenarioConfig, Scenario } from "./scenarios";
import type { Assumption } from "./assumption";
import type { RevenueSchedule } from "./revenue";
import { ProjectedYears } from "./constant";

export interface VariableCosts {
    year: number;
    rawMaterials: number;
    utilities: number;
    totalVariableCosts: number;
}

export interface FixedCosts {
    year: number;
    rent: number;
    operatingLabour: number;
    other: number;
    totalFixedCosts: number;
}

interface CostsPerUnit {
    year: number;
    variableCosts: VariableCosts;
    fixedCosts: FixedCosts;
    totalCosts: number;
}

interface CostsInTotal {
    year: number;
    variableCosts: VariableCosts;
    fixedCosts: FixedCosts;
    totalCosts: number;
}

export interface Costs {
    year: number;
    costsPerUnit: CostsPerUnit;
    costsInTotal: CostsInTotal;
}

const calcVariableCosts = ({
    prevYearVariableCosts,
    inflationRate
}: {
    prevYearVariableCosts: VariableCosts,
    inflationRate: number;
}): VariableCosts => {
    const rawMaterials = prevYearVariableCosts.rawMaterials * (1 + inflationRate);
    const utilities = prevYearVariableCosts.utilities * (1 + inflationRate);
    return {
        year: prevYearVariableCosts.year + 1,
        rawMaterials,
        utilities,
        totalVariableCosts: rawMaterials + utilities
    }
}

const calcFixedCosts = ({
    prevYearFixedCosts,
    inflationRate
}: {
    prevYearFixedCosts: FixedCosts,
    inflationRate: number;
}): FixedCosts => {

    const rent = prevYearFixedCosts.rent * (1 + inflationRate);
    const operatingLabour = prevYearFixedCosts.operatingLabour * (1 + inflationRate);
    const other = prevYearFixedCosts.other * (1 + inflationRate);

    return {
        year: prevYearFixedCosts.year + 1,
        rent,
        operatingLabour,
        other,
        totalFixedCosts: rent + operatingLabour + other
    }

}

const toInTotal = ({
    variableCosts,
    annualSalesVolumn
}: {
    variableCosts: VariableCosts;
    annualSalesVolumn: number;
}): VariableCosts => {
    return {
        year: variableCosts.year,
        rawMaterials: variableCosts.rawMaterials * annualSalesVolumn,
        utilities: variableCosts.utilities * annualSalesVolumn,
        totalVariableCosts: variableCosts.totalVariableCosts * annualSalesVolumn,
    }
}

const toPerUnit = ({
    fixedCosts,
    annualSalesVolumn
}: {
    fixedCosts: FixedCosts;
    annualSalesVolumn: number;
}): FixedCosts => {
    return {
        year: fixedCosts.year,
        rent: fixedCosts.rent / annualSalesVolumn,
        operatingLabour: fixedCosts.operatingLabour / annualSalesVolumn,
        other: fixedCosts.other / annualSalesVolumn,
        totalFixedCosts: fixedCosts.totalFixedCosts / annualSalesVolumn
    }
}


const calcCosts = ({
    prevYearCosts,
    scenario,
    annualSalesVolumn,
    costInflationScenarioConfig
}: {
    prevYearCosts: Costs;
    scenario: Scenario;
    annualSalesVolumn: number;
    costInflationScenarioConfig: CostInflationScenarioConfig;
}): Costs => {
    const currentYear = prevYearCosts.year + 1;
    const inflationConfig = costInflationScenarioConfig[scenario].find(item => item.year === currentYear);
    if (!inflationConfig) {
        // TODO error handling
        return prevYearCosts
    }

    const variableCostsPerUnit = calcVariableCosts({
        inflationRate: inflationConfig.inflationRate,
        prevYearVariableCosts: prevYearCosts.costsPerUnit.variableCosts
    })

    const variableCostsInTotal = toInTotal({
        variableCosts: variableCostsPerUnit,
        annualSalesVolumn
    })

    const fixedCostsInTotal = calcFixedCosts({
        prevYearFixedCosts: prevYearCosts.costsInTotal.fixedCosts,
        inflationRate: inflationConfig.inflationRate,
    })

    const fixedCostsPerUnit = toPerUnit({
        fixedCosts: fixedCostsInTotal,
        annualSalesVolumn
    })

    return {
        year: currentYear,
        costsPerUnit: {
            year: currentYear,
            variableCosts: variableCostsPerUnit,
            fixedCosts: fixedCostsPerUnit,
            totalCosts: variableCostsPerUnit.totalVariableCosts + fixedCostsPerUnit.totalFixedCosts
        },
        costsInTotal: {
            year: currentYear,
            variableCosts: variableCostsInTotal,
            fixedCosts: fixedCostsInTotal,
            totalCosts: variableCostsInTotal.totalVariableCosts + fixedCostsInTotal.totalFixedCosts
        }
    }
}

const calcStartProjectedYearCosts = ({
    assumption,
    startProjectedYear,
    annualSalesVolumn
}: {
    assumption: Assumption;
    startProjectedYear: number;
    annualSalesVolumn: number;
}): Costs => {

    const variableCostsPerUnit: VariableCosts = {
        year: startProjectedYear,
        rawMaterials: assumption.costs.rawMaterials,
        utilities: assumption.costs.utilities,
        totalVariableCosts: assumption.costs.rawMaterials + assumption.costs.utilities
    }

    const variableCostsInTotal = toInTotal({
        variableCosts: variableCostsPerUnit,
        annualSalesVolumn
    })

    const fixedCostsInTotal: FixedCosts = {
        year: startProjectedYear,
        rent: assumption.costs.rent,
        operatingLabour: assumption.costs.operatingLabour,
        other: assumption.costs.other,
        totalFixedCosts: assumption.costs.rent + assumption.costs.operatingLabour + assumption.costs.other
    }

    const fixedCostsPerUnit = toPerUnit({
        fixedCosts: fixedCostsInTotal,
        annualSalesVolumn
    })


    return {
        year: startProjectedYear,
        costsPerUnit: {
            year: startProjectedYear,
            variableCosts: variableCostsPerUnit,
            fixedCosts: fixedCostsPerUnit,
            totalCosts: variableCostsPerUnit.totalVariableCosts + fixedCostsPerUnit.totalFixedCosts
        },
        costsInTotal: {
            year: startProjectedYear,
            variableCosts: variableCostsInTotal,
            fixedCosts: fixedCostsInTotal,
            totalCosts: variableCostsInTotal.totalVariableCosts + fixedCostsInTotal.totalFixedCosts
        }
    }
}

const matchRevenueSchedule = ({
    revenueSchedule,
    year
}:{
     revenueSchedule: RevenueSchedule[];
     year:number
}):RevenueSchedule=> {
    return revenueSchedule.find(item=>item.year === year)!
}

export const calcCostsSchedule = ({
    revenueSchedule,
    assumption,
    startProjectedYear,
    scenario,
    costInflationScenarioConfig
}: {
    revenueSchedule: RevenueSchedule[];
    assumption: Assumption;
    startProjectedYear: number;
    scenario: Scenario;
    costInflationScenarioConfig: CostInflationScenarioConfig;
}): Costs[] => {

    const startProjectedYearCosts = calcStartProjectedYearCosts({
        assumption,
        startProjectedYear,
        annualSalesVolumn: matchRevenueSchedule({
            revenueSchedule,
            year: startProjectedYear
        }).salesVolumn.annualSalesVolumn
    })

    console.log("sale volumn",matchRevenueSchedule({
            revenueSchedule,
            year: startProjectedYear
        }).salesVolumn.annualSalesVolumn)

    return ProjectedYears.slice(1).reduce<Costs[]>((acc, year) => {
        return [
            ...acc,
            calcCosts({
                prevYearCosts: acc[acc.length - 1],
                scenario,
                annualSalesVolumn: matchRevenueSchedule({
                    revenueSchedule,
                    year
                }).salesVolumn.annualSalesVolumn,
                costInflationScenarioConfig
            })
        ]
    }, [startProjectedYearCosts]);


}