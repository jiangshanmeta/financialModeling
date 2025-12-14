import { createAsset, createEquity, createLiability, type BalanceSheet } from "../model/balanceSheet"
import { MM, StartYear } from "../model/constant"


export const StartYearLananceSheet = (): BalanceSheet=>{
    const defaultStartYearAsset = createAsset({
        year: StartYear,
        cash: 0.3 * MM,
        accountsReceivable: 28.3 * MM,
        inventory: 35.1 * MM,
        prepaidExpenses: 14.9 * MM,
        currentAssetOther: 1.2 * MM,
        netPPE: 397.7 * MM,
        longTermAssetOther: 12.0 * MM
    })

    const defaultStartYearLiability = createLiability({
        year: StartYear,
        bankDebtRevolver: 0.0 * MM,
        accountsPayable: 18.2 * MM,
        otherCurrentLiability: 4.8 * MM,
        deferredIncomeTaxes: 8.0 * MM,
        seniorSecuredTermDebt: 200.0 * MM,
    })

    const defaultStartYearEquity = createEquity({
        year: StartYear,
        commonShares: 120.0 * MM,
        retainedEarnings: 138.6 * MM,
    })

    return {
        year: StartYear,
        asset: defaultStartYearAsset,
        liability: defaultStartYearLiability,
        equity: defaultStartYearEquity
    }

}