import type { Assumption } from "./assumption";
import type { BalanceSheet } from "./balanceSheet";
import { calcFCFAfterMandatoryDebtAndDividend } from "./debtInterest";
import { calcDividend } from "./equitySchedule";
import type { IncomeStatement } from "./incomeStatement";
import type { WorkingCapitalSchedule } from "./workingCapital";

export interface CashFlowStatement {
    year: number;
    operating: {
        netIncome: number;
        depreciationAmotization: number;
        deferredIncomeTaxes: number;
        changesInWorkingCapital: number;
        operatingCashFlow: number;
    },
    investing: {
        CAPEX: number;
        otherInvestment: number;
        investingCashFlow: number;
    },
    financing: {
        revolverIssuance: number;
        termDebtIssuance: number;
        commonSharesIssuance: number;
        commonDividends: number;
        financingCashFlow: number;
    },
    changeInCashPosition: number;
}


export const createCashFlowStatement = ({
    year,
    incomeStatement,
    workingCapitalSchedule,
    assumption,
    preYearBalanceSheet
}: {
    year: number;
    incomeStatement: IncomeStatement;
    workingCapitalSchedule: WorkingCapitalSchedule[];
    assumption: Assumption,
    preYearBalanceSheet: BalanceSheet
}): CashFlowStatement => {

    const netIncome = incomeStatement.netIncome;
    const depreciationAmotization = incomeStatement.depreciation;
    const deferredIncomeTaxes = incomeStatement.deferredIncomeTax;
    const changesInWorkingCapital = workingCapitalSchedule.find(item => item.year === year)?.changeInWorkingCapital ?? 0;
    const operatingCashFlow = netIncome + depreciationAmotization + deferredIncomeTaxes + changesInWorkingCapital;

    const CAPEX = -(assumption.capitalExpenditure.find(item => item.year === year)?.carryingAmount ?? 0);
    const otherInvestment = assumption.investingActivity.find(item => item.year === year)?.otherInvestment ?? 0;
    const investingCashFlow = CAPEX + otherInvestment;

    const commonDividends = -calcDividend({
        netIncome,
        dividendPayoutRate: assumption.equity.commonDividendPayoutRate
    })

    const FCFAfterMandatoryDebtAndDividend = calcFCFAfterMandatoryDebtAndDividend({
        year,
        assumption,
        operatingCashFlow,
        investingCashFlow,
        dividends: commonDividends,
        mandatoryDebtRepayments: assumption.changeInDebtEquity.find(item => item.year === year)?.seniorTermDebtIssuance ?? 0,
    })

    const revolverIssuance = -Math.min(preYearBalanceSheet.asset.currentAsset.cash + FCFAfterMandatoryDebtAndDividend, preYearBalanceSheet.liability.currentLiability.bankDebtRevolver)
    const termDebtIssuance = assumption.changeInDebtEquity.find(item => item.year === year)?.seniorTermDebtIssuance ?? 0;
    const commonSharesIssuance = assumption.changeInDebtEquity.find(item => item.year === year)?.commonStockIssuance ?? 0;
    const financingCashFlow = revolverIssuance + termDebtIssuance + commonSharesIssuance + commonDividends;

    return {
        year,
        operating: {
            netIncome,
            depreciationAmotization,
            deferredIncomeTaxes,
            changesInWorkingCapital,
            operatingCashFlow
        },
        investing: {
            CAPEX,
            otherInvestment,
            investingCashFlow
        },
        financing: {
            revolverIssuance,
            termDebtIssuance,
            commonSharesIssuance,
            commonDividends,
            financingCashFlow,
        },
        changeInCashPosition: operatingCashFlow + investingCashFlow + financingCashFlow
    }

}