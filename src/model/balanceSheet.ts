import { MM } from "./constant";

interface CurrentAsset {
    year: number;
    cash: number;
    accountReceiveable: number;
    inventory: number;
    prepaidExpenses: number;
    currentAssetOther: number;
    totalCurrentAsset: number;
}

const calcTotalCurrentAsset = ({
    cash,
    accountReceiveable,
    inventory,
    prepaidExpenses,
    currentAssetOther
}: Omit<CurrentAsset, "year" | "totalCurrentAsset">) => cash + accountReceiveable + inventory + prepaidExpenses + currentAssetOther;

interface LongTermAsset {
    year: number;
    netPPE : number;
    longTermAssetOther: number;
    totalLongTermAsset: number;
}

const calcTotalLongTermAsset = ({
    netPPE,
    longTermAssetOther
}:Omit<LongTermAsset,"year" | "totalLongTermAsset" >)=> netPPE+longTermAssetOther

interface Asset {
    year: number;
    currentAsset: CurrentAsset;
    longTermAsset: LongTermAsset;
    totalAsset: number;
}

const calcTotalAsset = ({
    currentAsset,
    longTermAsset
}:Omit<Asset,"year" | "totalAsset">)=> currentAsset.totalCurrentAsset + longTermAsset.totalLongTermAsset


const createAsset = ({
    year,
    cash,
    accountReceiveable,
    inventory,
    prepaidExpenses,
    currentAssetOther,
    netPPE,
    longTermAssetOther
}:Omit<CurrentAsset,"totalCurrentAsset">&Omit<LongTermAsset,"totalLongTermAsset"> ):Asset=>{
    const currentAsset: CurrentAsset = {
        year,
        cash,
        accountReceiveable,
        inventory,
        prepaidExpenses,
        currentAssetOther,
        totalCurrentAsset: calcTotalCurrentAsset({
            cash, 
            accountReceiveable, 
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

export const defaultStartYearAsset = createAsset({
    year: 2022,
    cash: 0.3 * MM,
    accountReceiveable: 28.3 * MM,
    inventory: 35.1 * MM,
    prepaidExpenses: 14.9 * MM,
    currentAssetOther: 1.2 * MM,
    netPPE: 397.7 * MM,
    longTermAssetOther: 12.0 * MM
})