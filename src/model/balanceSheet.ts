export interface CurrentAsset {
    year: number;
    cash: number;
    accountsReceivable: number;
    inventory: number;
    prepaidExpenses: number;
    currentAssetOther: number;
    totalCurrentAsset: number;
}

const calcTotalCurrentAsset = ({
    cash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    currentAssetOther
}: Omit<CurrentAsset, "year" | "totalCurrentAsset">) => cash + accountsReceivable + inventory + prepaidExpenses + currentAssetOther;

interface LongTermAsset {
    year: number;
    netPPE: number;
    longTermAssetOther: number;
    totalLongTermAsset: number;
}

const calcTotalLongTermAsset = ({
    netPPE,
    longTermAssetOther
}: Omit<LongTermAsset, "year" | "totalLongTermAsset">) => netPPE + longTermAssetOther

interface Asset {
    year: number;
    currentAsset: CurrentAsset;
    longTermAsset: LongTermAsset;
    totalAsset: number;
}

const calcTotalAsset = ({
    currentAsset,
    longTermAsset
}: Omit<Asset, "year" | "totalAsset">) => currentAsset.totalCurrentAsset + longTermAsset.totalLongTermAsset


export const createAsset = ({
    year,
    cash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    currentAssetOther,
    netPPE,
    longTermAssetOther
}: Omit<CurrentAsset, "totalCurrentAsset"> & Omit<LongTermAsset, "totalLongTermAsset">): Asset => {
    const currentAsset: CurrentAsset = {
        year,
        cash,
        accountsReceivable,
        inventory,
        prepaidExpenses,
        currentAssetOther,
        totalCurrentAsset: calcTotalCurrentAsset({
            cash,
            accountsReceivable,
            inventory,
            prepaidExpenses,
            currentAssetOther
        })
    }

    const longTermAsset: LongTermAsset = {
        year,
        netPPE,
        longTermAssetOther,
        totalLongTermAsset: calcTotalLongTermAsset({
            netPPE,
            longTermAssetOther,
        })
    }

    return {
        year,
        currentAsset,
        longTermAsset,
        totalAsset: calcTotalAsset({
            currentAsset,
            longTermAsset
        })
    }

}

export interface CurrentLiability {
    year: number;
    bankDebtRevolver: number;
    accountsPayable: number;
    otherCurrentLiability: number;
    totalCurrentLiability: number;
}

interface LongTermLiability {
    year: number;
    deferredIncomeTaxes: number;
    seniorSecuredTermDebt: number;
    totalLongTermLiability: number;
}

interface Liability {
    year: number;
    currentLiability: CurrentLiability;
    longTermLiability: LongTermLiability;
    totalLiability: number;
}

const calcTotalCurrentLiability = ({
    bankDebtRevolver,
    accountsPayable,
    otherCurrentLiability
}: Omit<CurrentLiability, "year" | "totalCurrentLiability">) => bankDebtRevolver + accountsPayable + otherCurrentLiability


const calcTotalLongTermLiability = ({
    deferredIncomeTaxes,
    seniorSecuredTermDebt
}: Omit<LongTermLiability, "year" | "totalLongTermLiability">) => deferredIncomeTaxes + seniorSecuredTermDebt

const calcTotalLiability = ({
    currentLiability,
    longTermLiability
}: {
    currentLiability: CurrentLiability;
    longTermLiability: LongTermLiability;
}) => {
    return currentLiability.totalCurrentLiability + longTermLiability.totalLongTermLiability
}



export const createLiability = ({
    year,
    bankDebtRevolver,
    accountsPayable,
    otherCurrentLiability,
    deferredIncomeTaxes,
    seniorSecuredTermDebt
}: Omit<CurrentLiability, "totalCurrentLiability"> & Omit<LongTermLiability, "totalLongTermLiability">

): Liability => {

    const currentLiability: CurrentLiability = {
        year,
        bankDebtRevolver,
        accountsPayable,
        otherCurrentLiability,
        totalCurrentLiability: calcTotalCurrentLiability({
            bankDebtRevolver,
            accountsPayable,
            otherCurrentLiability,
        })

    }

    const longTermLiability: LongTermLiability = {
        year,
        deferredIncomeTaxes,
        seniorSecuredTermDebt,
        totalLongTermLiability: calcTotalLongTermLiability({
            deferredIncomeTaxes,
            seniorSecuredTermDebt,
        })
    }

    return {
        year,
        currentLiability,
        longTermLiability,
        totalLiability: calcTotalLiability({
            currentLiability,
            longTermLiability
        })
    }


}


interface Equity {
    year: number;
    commonShares: number;
    retainedEarnings: number;
    totalEquity: number;
}

export interface BalanceSheet {
    year: number;
    asset: Asset,
    liability: Liability,
    equity: Equity
}

const calcTotalEquity = ({ commonShares, retainedEarnings }: Omit<Equity, "year" | "totalEquity">) => commonShares + retainedEarnings

export const createEquity = ({ year, commonShares, retainedEarnings }: Omit<Equity, "totalEquity">): Equity => {

    return {
        year,
        commonShares,
        retainedEarnings,
        totalEquity: calcTotalEquity({
            commonShares,
            retainedEarnings,
        })
    }

}

