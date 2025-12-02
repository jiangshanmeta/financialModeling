import { PERCENT, ProjectedYears } from "./constant"

export type Scenarios = "base" | "best" | "worst"

export const PriceIncreaseRate: Record<Exclude<Scenarios, "base">, number> = {
    best: 4 * PERCENT,
    worst: -4 * PERCENT,
}

interface CostInflation {
    year: number;
    inflationRate: number;
}

export const CostInflationScenarios: Record<Scenarios, CostInflation[]> = {
    base: [
        {
            year: ProjectedYears[0],
            inflationRate: 2 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            inflationRate: 2 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            inflationRate: 2 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            inflationRate: 2.5 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            inflationRate: 2.6 * PERCENT,
        }
    ],
    best: [
        {
            year: ProjectedYears[0],
            inflationRate: 1.8 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            inflationRate: 1.8 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            inflationRate: 1.8 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            inflationRate: 2 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            inflationRate: 2 * PERCENT,
        }
    ],
    worst: [
        {
            year: ProjectedYears[0],
            inflationRate: 2.5 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            inflationRate: 2.5 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            inflationRate: 2.5 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            inflationRate: 2.5 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            inflationRate: 2.5 * PERCENT,
        }
    ]
}

interface SalesPricePerUnit {
    year: number;
    salesPrice: number;
}

const SalesPriceBase: SalesPricePerUnit[] = [
    {
        year: ProjectedYears[0],
        salesPrice: 800,
    },
    {
        year: ProjectedYears[1],
        salesPrice: 725,
    },
    {
        year: ProjectedYears[2],
        salesPrice: 825,
    },
    {
        year: ProjectedYears[3],
        salesPrice: 800,
    },
    {
        year: ProjectedYears[4],
        salesPrice: 750
    }
]

const calcSalesPrices = (salesPricePerUnits: SalesPricePerUnit[], inflationRate: number): SalesPricePerUnit[] => {
    return salesPricePerUnits.map((item) => {
        return {
            ...item,
            salesPrice: item.salesPrice * (1 + inflationRate)
        }
    })

}

export const SalesPriceScenarios: Record<Scenarios, SalesPricePerUnit[]> = {
    base: SalesPriceBase,
    best: calcSalesPrices(SalesPriceBase, PriceIncreaseRate.best),
    worst: calcSalesPrices(SalesPriceBase, PriceIncreaseRate.worst)
}

interface SalesVolumnGrowth {
    year: number;
    salesVolumnGrowthRate: number;
}

export const SalesVolumnGrowthScenarios: Record<Scenarios, SalesVolumnGrowth[]> = {
    base: [
        {
            year: ProjectedYears[0],
            salesVolumnGrowthRate: 5 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
    ],
    best: [
        {
            year: ProjectedYears[0],
            salesVolumnGrowthRate: 5 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            salesVolumnGrowthRate: 5 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            salesVolumnGrowthRate: 5 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            salesVolumnGrowthRate: 4 * PERCENT,
        },


    ],
    worst: [
        {
            year: ProjectedYears[0],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[1],
            salesVolumnGrowthRate: 4 * PERCENT,
        },
        {
            year: ProjectedYears[2],
            salesVolumnGrowthRate: 3 * PERCENT,
        },
        {
            year: ProjectedYears[3],
            salesVolumnGrowthRate: 3 * PERCENT,
        },
        {
            year: ProjectedYears[4],
            salesVolumnGrowthRate: 2 * PERCENT,
        },
    ]
}

