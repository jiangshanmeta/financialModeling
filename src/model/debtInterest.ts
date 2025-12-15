import type { Assumption } from "./assumption"

interface DebtInterest {
    year: number;
    cash: {
        amountOutstandingBeginning: number;
        interestRate: number;
        annualInterestIncome: number;
    },
    revolver: {
        revolverOutstandingBeginning: number;
        interestRate: number;
        annualInterestExpense: number;
    },
    seniorSecuredTermDebt: {
        amountOutstandingBeginning: number;
        interestRate: number;
        annualInterestExpense: number;
    },
    netInterestExpense: number;
}

export const calcDebtInterest = ({
    year,
    interestRate,
    prevYear,
}: {
    year: number;
    interestRate: Assumption["interestRate"];
    prevYear: {
        cash: number;
        revolver: number;
        seniorSecuredTermDebt: number;
    }
}): DebtInterest => {

    const cashInterestIncome = prevYear.cash * interestRate.interestRateOnCashBalances;
    const revolverInterestExpense = prevYear.revolver * interestRate.interestRateOnBankRevolver;
    const seniorSecuredTermDebtInterestExpense = prevYear.seniorSecuredTermDebt * interestRate.interestRateOnSeniorSecuredTermDebt;

    return {
        year,
        cash: {
            amountOutstandingBeginning: prevYear.cash,
            interestRate: interestRate.interestRateOnCashBalances,
            annualInterestIncome: cashInterestIncome
        },
        revolver: {
            revolverOutstandingBeginning: prevYear.revolver,
            interestRate: interestRate.interestRateOnBankRevolver,
            annualInterestExpense: revolverInterestExpense,
        },
        seniorSecuredTermDebt: {
            amountOutstandingBeginning: prevYear.seniorSecuredTermDebt,
            interestRate: interestRate.interestRateOnSeniorSecuredTermDebt,
            annualInterestExpense: seniorSecuredTermDebtInterestExpense
        },
        netInterestExpense: seniorSecuredTermDebtInterestExpense + revolverInterestExpense - cashInterestIncome
    }

}

export const calcFCFAfterMandatoryDebtAndDividend = ({
    year,
    assumption,
    operatingCashFlow,
    investingCashFlow,
    // repayment means cashflow out
    mandatoryDebtRepayments,
    // dividends means cashflow out, it should be negative
    dividends
}: {
    year: number;
    assumption: Assumption;
    operatingCashFlow: number;
    investingCashFlow: number;
    mandatoryDebtRepayments: number;
    dividends: number;
}) => {
    const commonStockIssurance = assumption.equity.commonStockIssurance.find(item => item.year === year)?.amount ?? 0;

    return operatingCashFlow + investingCashFlow + mandatoryDebtRepayments + commonStockIssurance + dividends;
}