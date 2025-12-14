import type { Assumption } from "./assumption";
import { StartProjectedYear } from "./constant";
import type { Costs } from "./cost";
import { calcDebtInterest } from "./debtInterest";
import type { DepreciationSchedule } from "./depreciation";
import { calcIncomeTax } from "./incomeTax";
import type { RevenueSchedule } from "./revenue";
import type { CostInflationScenarioConfig, Scenario } from "./scenarios";

export interface IncomeStatement {
    year: number;
    gorssRevenue: number;
    freightWarehousing: number;
    netRevenue: number;

    COGS: number;
    "SG&A": number;
    totalCosts: number;

    costAdjustment: number;
    EBITDA: number;

    depreciation: number;
    EBIT: number;

    interestExpense: number;
    EBT: number;

    currentIncomeTax: number;
    deferredIncomeTax: number;
    totalIncomeTax: number;

    netIncome: number;
}

const calcSGA = ({
    year,
    scenario,
    costInflationScenarioConfig,
    assumption
}: {
    year: number,
    scenario: Scenario;
    costInflationScenarioConfig: CostInflationScenarioConfig,
    assumption: Assumption
}) => {
    let SGA = assumption.costs["SG&A"];
    if (year === StartProjectedYear) {
        return SGA;
    }
    const inflations = costInflationScenarioConfig[scenario];

    for (let i = 0; i < inflations.length; i++) {
        SGA *= (1 + inflations[i].inflationRate)
        if (inflations[i].year === year) {
            break;
        }
    }

    return SGA;
}

export const createIncomeStatement = ({
    year,
    revenueSchedule,
    costs,
    scenario,
    costInflationScenarioConfig,
    assumption,
    depreciationSchedule,
    prevYear
}: {
    year: number,
    revenueSchedule: RevenueSchedule
    costs: Costs,
    scenario: Scenario;
    costInflationScenarioConfig: CostInflationScenarioConfig,
    assumption: Assumption,
    depreciationSchedule: DepreciationSchedule;
    prevYear: {
        cash: number;
        revolver: number;
        seniorSecuredTermDebt: number;
    }
}): IncomeStatement => {

    const netRevenue = revenueSchedule.revenue.netRevenue;
    const COGS = costs.costsInTotal.totalCosts;
    const SGA = calcSGA({
        year,
        scenario,
        assumption,
        costInflationScenarioConfig
    })

    const totalCosts = COGS + SGA;
    const costAdjustment = assumption.costAdjustment.find(item => item.year === year)?.amount ?? 0;

    const EBITDA = netRevenue - totalCosts + costAdjustment;

    const depreciation = depreciationSchedule.aggregateDepreciation.find(item => item.year === year)?.carryingAmount ?? 0;

    const EBIT = EBITDA - depreciation;

    const interestExpense = calcDebtInterest({
        year,
        interestRate: assumption.interestRate,
        prevYear: {
            cash: prevYear.cash,
            revolver: prevYear.revolver,
            seniorSecuredTermDebt: prevYear.seniorSecuredTermDebt
        }
    }).netInterestExpense;

    const EBT = EBIT - interestExpense;

    const incomeTax = calcIncomeTax({
        year,
        assumption,
        accountingEBT: EBT,
    })

    return {
        year,
        gorssRevenue: revenueSchedule.revenue.grossRevenue,
        freightWarehousing: revenueSchedule.revenue.freightWarehousing,
        netRevenue,
        COGS,
        "SG&A": SGA,
        totalCosts,
        costAdjustment,
        EBITDA,
        depreciation,
        EBIT,
        interestExpense,
        EBT,
        currentIncomeTax: incomeTax.currentTax,
        deferredIncomeTax: incomeTax.DTL,
        totalIncomeTax: incomeTax.totalIncomeTax,
        netIncome: EBT - incomeTax.totalIncomeTax
    }
}

