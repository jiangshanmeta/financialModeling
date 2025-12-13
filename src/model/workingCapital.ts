import type { WorkingCapitalDays } from "./assumption";
import type { BalanceSheet, CurrentAsset, CurrentLiability } from "./balanceSheet";
import type { Costs } from "./cost";
import type { RevenueSchedule } from "./revenue";

const YEAR_DAYS = 365;

const calcNetWorkingCapital = ({
    accountsReceivable,
    inventories,
    prepaidExpenses,
    otherAssets,
    accountsPayable,
    otherLiabilities
}: Omit<WorkingCapitalDays, "year">) => {
    return accountsReceivable + inventories + prepaidExpenses + otherAssets - accountsPayable - otherLiabilities
}

const predicateBalanceSheetByWorkingCapitalDays = ({
    year,
    netRevenue,
    COGS,
    ...workingCapitalDays
}: WorkingCapitalDays & {
    netRevenue: number;
    COGS: number;
}) => {

    // use end value rather than avg value for simplicity
    const accountsReceivable = netRevenue * workingCapitalDays.accountsReceivable / YEAR_DAYS;
    const inventories = COGS * workingCapitalDays.inventories / YEAR_DAYS;
    const prepaidExpenses = COGS * workingCapitalDays.prepaidExpenses / YEAR_DAYS;
    const otherAssets = COGS * workingCapitalDays.otherAssets / YEAR_DAYS;

    // use COSG instead of purchase for simplicity
    const accountsPayable = COGS * workingCapitalDays.accountsPayable / YEAR_DAYS;
    const otherLiabilities = COGS * workingCapitalDays.otherLiabilities / YEAR_DAYS;

    const netWorkingCapital = calcNetWorkingCapital({
        accountsReceivable,
        inventories,
        prepaidExpenses,
        otherAssets,
        accountsPayable,
        otherLiabilities
    })

    return {
        year,
        accountsReceivable,
        inventories,
        prepaidExpenses,
        otherAssets,
        accountsPayable,
        otherLiabilities,
        netWorkingCapital
    }

}

export type WorkingCapitalBalanceSheet = ReturnType<typeof predicateBalanceSheetByWorkingCapitalDays>

const calcWorkingCapitalDaysByBalanceSheet = ({
    year,
    netRevenue,
    COGS,
    ...balanceSheet
}:
    Pick<CurrentAsset, "year" | "accountsReceivable" | "inventory" | "prepaidExpenses" | "currentAssetOther">
    & Pick<CurrentLiability, "accountsPayable" | "otherCurrentLiability"> & {
        netRevenue: number;
        COGS: number;
    }
): WorkingCapitalDays => {

    return {
        year,

        accountsReceivable: YEAR_DAYS / (netRevenue / balanceSheet.accountsReceivable),
        inventories: YEAR_DAYS / (COGS / balanceSheet.inventory),
        prepaidExpenses: YEAR_DAYS / (COGS / balanceSheet.prepaidExpenses),
        otherAssets: YEAR_DAYS / (COGS / balanceSheet.currentAssetOther),

        accountsPayable: YEAR_DAYS / (COGS / balanceSheet.accountsPayable),
        otherLiabilities: YEAR_DAYS / (COGS / balanceSheet.otherCurrentLiability)
    }

}

export interface WorkingCapitalSchedule {
    year: number;
    workingCapitalDays: WorkingCapitalDays;
    balanceSheet: WorkingCapitalBalanceSheet
}


const findNetRevenue = ({
    year,
    revenueSchedule
}: {
    year: number;
    revenueSchedule: RevenueSchedule[]
}) => {
    return revenueSchedule.find(item => item.year === year)?.revenue.netRevenue ?? 0
}

const findCOGS = ({
    year,
    costs
}: {
    year: number;
    costs: Costs[];
}) => {
    return costs.find(item => item.year === year)?.costsInTotal.totalCosts ?? 0
}


export const calcWorkingCapitalSchedule = ({
    workingCapitalDays,
    revenueSchedule,
    costs,
    historyBalanceSheet
}: {
    workingCapitalDays: WorkingCapitalDays[];
    revenueSchedule: RevenueSchedule[];
    costs: Costs[];
    historyBalanceSheet: BalanceSheet[]
}): WorkingCapitalSchedule[] => {

    return [
        ...historyBalanceSheet.map((balanceSheet) => {
            const year = balanceSheet.asset.year
            const wcDays = calcWorkingCapitalDaysByBalanceSheet({
                year,
                accountsReceivable: balanceSheet.asset.currentAsset.accountsReceivable,
                inventory: balanceSheet.asset.currentAsset.inventory,
                prepaidExpenses: balanceSheet.asset.currentAsset.prepaidExpenses,
                currentAssetOther: balanceSheet.asset.currentAsset.currentAssetOther,
                accountsPayable: balanceSheet.liability.currentLiability.accountsPayable,
                otherCurrentLiability: balanceSheet.liability.currentLiability.otherCurrentLiability,
                netRevenue: findNetRevenue({ year, revenueSchedule }),
                COGS: findCOGS({ year, costs })
            })

            return {
                year,
                workingCapitalDays: wcDays,
                balanceSheet: {
                    year,
                    accountsReceivable: balanceSheet.asset.currentAsset.accountsReceivable,
                    inventories: balanceSheet.asset.currentAsset.inventory,
                    prepaidExpenses: balanceSheet.asset.currentAsset.prepaidExpenses,
                    otherAssets: balanceSheet.asset.currentAsset.currentAssetOther,
                    accountsPayable: balanceSheet.liability.currentLiability.accountsPayable,
                    otherLiabilities: balanceSheet.liability.currentLiability.otherCurrentLiability,
                    netWorkingCapital: calcNetWorkingCapital({
                        accountsReceivable: balanceSheet.asset.currentAsset.accountsReceivable,
                        inventories: balanceSheet.asset.currentAsset.inventory,
                        prepaidExpenses: balanceSheet.asset.currentAsset.prepaidExpenses,
                        otherAssets: balanceSheet.asset.currentAsset.currentAssetOther,
                        accountsPayable: balanceSheet.liability.currentLiability.accountsPayable,
                        otherLiabilities: balanceSheet.liability.currentLiability.otherCurrentLiability,
                    }),
                }
            }

        }),
        ...workingCapitalDays.map((wcDays) => {
            const predicatedBalanceSheet = predicateBalanceSheetByWorkingCapitalDays({
                ...wcDays,
                netRevenue: findNetRevenue({ year: wcDays.year, revenueSchedule }),
                COGS: findCOGS({ year: wcDays.year, costs }),
            })

            return {
                year: wcDays.year,
                workingCapitalDays: wcDays,
                balanceSheet: predicatedBalanceSheet,
            }

        })
    ];
}