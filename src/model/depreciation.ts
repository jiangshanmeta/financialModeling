import { ProjectedYears } from "./constant";
import { type Assumption } from "./assumption";
interface DepreciationFromExistingAsset {
    depreciationYear: number;
    amount: number;
}

interface DepreciationFromNewAsset {
    assetInvestYear: number;
    depreciationYear: number;
    amount: number;
}

const calcDepreciationFromExistingAssetSchedule = ({
    initialCarryingValue,
    yearsRemainingForDepreciationOfExistingAssets,
}: {
    initialCarryingValue: number,
    yearsRemainingForDepreciationOfExistingAssets: number;
}): DepreciationFromExistingAsset[] => {
    const perYear = initialCarryingValue / yearsRemainingForDepreciationOfExistingAssets;

    return ProjectedYears.map((depreciationYear) => {
        const amount = Math.min(perYear, initialCarryingValue);
        initialCarryingValue -= amount;
        return {
            depreciationYear,
            amount
        }
    })
}

const calcDepreciationFromNewAssetSchedule = ({
    capitalExpenditure,
    yearsUsedForDepreciationOfNewAssets
}: {
    capitalExpenditure: Assumption['capitalExpenditure'],
    yearsUsedForDepreciationOfNewAssets: number
}): DepreciationFromNewAsset[] => {
    const depreciationSchedule: DepreciationFromNewAsset[] = [];
    for (const pastYear of ProjectedYears) {
        for (const futureYear of ProjectedYears) {
            if (pastYear > futureYear) {
                continue;
            }
            depreciationSchedule.push({
                assetInvestYear: pastYear,
                depreciationYear: futureYear,
                amount: 0,
            })

        }
    }

    for (const { year, carryingAmount } of capitalExpenditure) {
        let bookValue = carryingAmount
        const perYear = bookValue / yearsUsedForDepreciationOfNewAssets;
        for (const schedule of depreciationSchedule) {
            if (schedule.assetInvestYear !== year) {
                continue;
            }
            // mid-year convention
            const consumed = Math.min(bookValue, year === schedule.depreciationYear ? perYear / 2 : perYear);

            bookValue -= consumed;

            schedule.amount += consumed;
        }

    }


    return depreciationSchedule
}

export interface DepreciationSchedule {
    fromExistingAsset: DepreciationFromExistingAsset[];
    fromNewAsset: DepreciationFromNewAsset[];
    aggregateDepreciation: Array<{
        year: number;
        carryingAmount: number;
    }>
}

export const calcDepreciationSchedule = ({
    initialCarryingValue,
    capitalExpenditure,
    yearsRemainingForDepreciationOfExistingAssets,
    yearsUsedForDepreciationOfNewAssets,
}: Parameters<typeof calcDepreciationFromExistingAssetSchedule>[0] &
    Parameters<typeof calcDepreciationFromNewAssetSchedule>[0]

): DepreciationSchedule => {

    const fromExistingAsset = calcDepreciationFromExistingAssetSchedule({
        initialCarryingValue,
        yearsRemainingForDepreciationOfExistingAssets
    })

    const fromNewAsset = calcDepreciationFromNewAssetSchedule({
        capitalExpenditure,
        yearsUsedForDepreciationOfNewAssets
    })

    const aggregateDepreciation: DepreciationSchedule['aggregateDepreciation'] = ProjectedYears.map((year) => {
        return {
            year,
            carryingAmount: 0,
        }
    })

    for (const { depreciationYear, amount } of fromExistingAsset) {
        aggregateDepreciation.find(item => item.year === depreciationYear)!.carryingAmount += amount;
    }

    for (const { amount, depreciationYear } of fromNewAsset) {
        aggregateDepreciation.find(item => item.year === depreciationYear)!.carryingAmount += amount;
    }

    return {
        fromExistingAsset,
        fromNewAsset,
        aggregateDepreciation
    }
}