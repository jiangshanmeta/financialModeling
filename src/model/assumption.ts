import { MM, PERCENT, ProjectedYears } from "./constant";

interface Costs {
    rawMaterials: number;
    utilities: number;
    rent: number;
    operatingLabour: number;
    other: number;
    "SG&A": number;
}

interface CapitalExpenditure {
    year: number;
    carryingAmount: number;
}


export interface Assumption {
    costs: Costs;
    depreciation: {
        yearsRemainingForDepreciationOfExistingAssets: number;
        yearsUsedForDepreciationOfNewAssets: number;
    };
    capitalExpenditure: CapitalExpenditure[];
    tax: {
        taxRate: number;
        reductionInEBTForTimingDifferences: Array<{
            year: number;
            amount: number;
        }>
    }
}

export const DefaultAssumption: Assumption = {
    costs: {
        rawMaterials: 226,
        utilities: 66.2,
        rent: 23.5 * MM,
        operatingLabour: 43.5 * MM,
        other: 2 * MM,
        "SG&A": 3.9 * MM,
    },
    depreciation: {
        yearsRemainingForDepreciationOfExistingAssets: 25,
        yearsUsedForDepreciationOfNewAssets: 30
    },
    capitalExpenditure: [
        {
            year: ProjectedYears[0],
            carryingAmount: 16 * MM,
        },
        {
            year: ProjectedYears[1],
            carryingAmount: 17 * MM,
        },
        {
            year: ProjectedYears[2],
            carryingAmount: 17.3 * MM
        },
        {
            year: ProjectedYears[3],
            carryingAmount: 17.5 * MM,
        },
        {
            year: ProjectedYears[4],
            carryingAmount: 18 * MM
        }
    ],
    tax: {
        taxRate: 35 * PERCENT,
        reductionInEBTForTimingDifferences: [
            {
                year: ProjectedYears[0],
                amount: 5 * MM,
            },
            {
                year: ProjectedYears[1],
                amount: 5 * MM,
            },
            {
                year: ProjectedYears[2],
                amount: 5 * MM,
            },
            {
                year: ProjectedYears[3],
                amount: 5 * MM,
            },
            {
                year: ProjectedYears[4],
                amount: 5 * MM,
            },
        ]
    }
}