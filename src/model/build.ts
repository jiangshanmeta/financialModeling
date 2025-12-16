import type { Assumption } from "./assumption";
import { predicateBalanceSheet, type BalanceSheet } from "./balanceSheet";
import { createCashFlowStatement, type CashFlowStatement } from "./cashflowStatement";
import type { Costs } from "./cost";
import type { DepreciationSchedule } from "./depreciation";
import { createIncomeStatement, type IncomeStatement } from "./incomeStatement"
import type { RevenueSchedule } from "./revenue";
import type { CostInflationScenarioConfig, Scenario } from "./scenarios";
import type { WorkingCapitalSchedule } from "./workingCapital";

export interface FinancialStatement {
    year: number;
    incomeStatement: IncomeStatement;
    balanceSheet: BalanceSheet;
    cashFlowStatement: CashFlowStatement;
}


export const build = ({
    year,
    revenueSchedule,
    costsSchedule,
    assumption,
    prevYearBalanceSheet,
    scenario,
    costInflationScenarioConfig,
    depreciationSchedule,
    workingCapitalSchedule
}: {
    year: number,
    revenueSchedule: RevenueSchedule[],
    costsSchedule: Costs[],
    assumption: Assumption,
    prevYearBalanceSheet: BalanceSheet,
    scenario: Scenario,
    costInflationScenarioConfig: CostInflationScenarioConfig,
    depreciationSchedule: DepreciationSchedule,
    workingCapitalSchedule: WorkingCapitalSchedule[]
}): FinancialStatement => {

    const incomeStatement = createIncomeStatement({
        revenueSchedule: revenueSchedule.find(item => item.year === year)!,
        costs: costsSchedule.find(item => item.year === year)!,
        year,
        assumption,
        costInflationScenarioConfig,
        scenario,
        prevYear: {
            cash: prevYearBalanceSheet.asset.currentAsset.cash,
            revolver: prevYearBalanceSheet.liability.currentLiability.bankDebtRevolver,
            seniorSecuredTermDebt: prevYearBalanceSheet.liability.longTermLiability.seniorSecuredTermDebt,
        },
        depreciationSchedule,
    })


    const cashFlowStatement = createCashFlowStatement({
        assumption,
        year,
        preYearBalanceSheet: prevYearBalanceSheet,
        incomeStatement,
        workingCapitalSchedule,
    })

    const balanceSheet = predicateBalanceSheet({
        year,
        prevYearBalanceSheet: prevYearBalanceSheet,
        incomeStatement,
        cashFlowStatement,
        workingCapitalSchedule: workingCapitalSchedule.find(item => item.year === year)!,
    })


    return {
        year,
        incomeStatement,
        cashFlowStatement,
        balanceSheet,
    }
}