import type { Assumption } from "./assumption"

export const calcIncomeTax = ({
    year,
    assumption,
    accountingEBT
}: {
    year: number,
    assumption: Assumption,
    accountingEBT: number
}) => {
    const taxRate = assumption.tax.taxRate;
    const timingDifference = assumption.tax.reductionInEBTForTimingDifferences.find(item => item.year === year)?.amount ?? 0;
    const governmentEBT = accountingEBT - timingDifference;

    const accountingTax = accountingEBT * taxRate;
    const currentTax = taxRate * governmentEBT;

    const DTL = accountingEBT - currentTax;

    return {
        accountingEBT,
        taxRate,
        timingDifference,
        governmentEBT,
        accountingTax,
        currentTax,
        DTL,
        totalIncomeTax: accountingTax
    }
}