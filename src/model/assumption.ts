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

export interface WorkingCapitalDays {
    year: number;
    accountsReceivable: number;
    inventories: number;
    prepaidExpenses: number;
    otherAssets: number;
    accountsPayable: number;
    otherLiabilities: number;
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
    };
    workingCapitalDays: WorkingCapitalDays[]
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
    },
    workingCapitalDays: [
        {
            year: ProjectedYears[0],
            accountsReceivable: 48,
            inventories: 70,
            prepaidExpenses: 30,
            otherAssets: 3,
            accountsPayable: 40,
            otherLiabilities: 10
        },
        {
            year: ProjectedYears[1],
            accountsReceivable: 44,
            inventories: 65,
            prepaidExpenses: 30,
            otherAssets: 3,
            accountsPayable: 40,
            otherLiabilities: 10
        },
        {
            year: ProjectedYears[2],
            accountsReceivable: 40,
            inventories: 60,
            prepaidExpenses: 30,
            otherAssets: 3,
            accountsPayable: 40,
            otherLiabilities: 10
        },
        {
            year: ProjectedYears[3],
            accountsReceivable: 40,
            inventories: 60,
            prepaidExpenses: 30,
            otherAssets: 3,
            accountsPayable: 40,
            otherLiabilities: 10
        },
        {
            year: ProjectedYears[4],
            accountsReceivable: 40,
            inventories: 55,
            prepaidExpenses: 30,
            otherAssets: 3,
            accountsPayable: 40,
            otherLiabilities: 10
        }
    ]
}