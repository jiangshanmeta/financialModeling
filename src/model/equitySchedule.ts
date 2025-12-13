interface EquitySchedule {
    commonShares: {
        amountOutstandingBeginning: number;
        newInsurance: number;
        amountOutstandingEnding: number;
        dividendPayoutRate: number;
        netIncome: number;
        commonDividend: number;
    };
    retainedEarnings: {
        amountOutstandingBeginning: number;
        netIncome: number;
        commonDividend: number;
        amountOutstandingEnding: number;
    }
}


export const createEquityScheduleItem = ({
    commonSharesOutstanding,
    retainedEarningOutstanding,
    newInsurance,
    dividendPayoutRate,
    netIncome
}: {
    commonSharesOutstanding: number;
    retainedEarningOutstanding: number;
    newInsurance: number;
    dividendPayoutRate: number;
    netIncome: number;
}): EquitySchedule => {

    const commonDividend = dividendPayoutRate * Math.max(netIncome, 0);

    return {
        commonShares: {
            amountOutstandingBeginning: commonSharesOutstanding,
            newInsurance,
            amountOutstandingEnding: commonSharesOutstanding + newInsurance,
            dividendPayoutRate,
            netIncome,
            commonDividend
        },
        retainedEarnings: {
            amountOutstandingBeginning: retainedEarningOutstanding,
            netIncome,
            commonDividend,
            amountOutstandingEnding: retainedEarningOutstanding + netIncome - commonDividend
        }
    }

}