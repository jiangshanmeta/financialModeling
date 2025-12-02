import { AnnualFactoryCapacity, KILO, ProjectedYears, StartYear } from "./constant";
import { CostInflationScenarios, SalesPriceScenarios, SalesVolumnGrowthScenarios, type Scenarios } from "./scenarios";

interface Pricing {
    year: number;
    costInflation: number;
    grossSalesPrice: number;
    freightWarehousing: number;
    netSalesPrice: number;
}

const StartGrossSalesPrice = 694.4;
const StartFreightWarehousing = 100;

const calcNetSalesPrice = (grossSalesPrice: number, freightWarehousing: number) => grossSalesPrice - freightWarehousing

export const StartYearPricing: Pricing = {
    year: StartYear,
    costInflation: 0,
    grossSalesPrice: StartGrossSalesPrice,
    freightWarehousing: StartFreightWarehousing,
    netSalesPrice: calcNetSalesPrice(StartGrossSalesPrice, StartFreightWarehousing)
}

const calcPricing = (prevYearPricing: Pricing, scenarios: Scenarios): Pricing => {
    const currentYear = prevYearPricing.year + 1;
    const inflationConfig = CostInflationScenarios[scenarios].find(item => item.year === currentYear);
    const salesPriceConfig = SalesPriceScenarios[scenarios].find(item => item.year === currentYear);
    if (!inflationConfig || !salesPriceConfig) {
        return {
            year: currentYear,
            costInflation: NaN,
            grossSalesPrice: NaN,
            freightWarehousing: NaN,
            netSalesPrice: NaN,
        }
    }

    const freightWarehousing = prevYearPricing.freightWarehousing * (1 + inflationConfig.inflationRate)
    return {
        year: currentYear,
        costInflation: inflationConfig.inflationRate,
        grossSalesPrice: salesPriceConfig.salesPrice,
        freightWarehousing,
        netSalesPrice: salesPriceConfig.salesPrice - freightWarehousing
    }
}

const calcProjectedPricings = (initialPricing: Pricing, scenarios: Scenarios): Pricing[] => {
    return ProjectedYears.reduce<Pricing[]>((acc) => {
        return [
            ...acc,
            calcPricing(acc[acc.length - 1], scenarios)
        ]
    }, [initialPricing])
}

interface SalesVolumn {
    year: number;
    annualFactoryCapacity: number;
    salesVolumnGrowth: number;
    annualSalesVolumn: number;
    impliedOperatingRate: number;
}

export const StartYearSalesVolumn: SalesVolumn = {
    year: StartYear,
    annualFactoryCapacity: AnnualFactoryCapacity,
    salesVolumnGrowth: 0,
    annualSalesVolumn: 344.5 * KILO,
    impliedOperatingRate: 0
}

const calcSalesVolumn = (prevYearSalesVolumn: SalesVolumn, scenarios: Scenarios): SalesVolumn => {
    const currentYear = prevYearSalesVolumn.year + 1
    const salesVolumnGrowth = SalesVolumnGrowthScenarios[scenarios].find(item => item.year === currentYear)


    if (!salesVolumnGrowth) {
        return {
            year: currentYear,
            annualFactoryCapacity: NaN,
            salesVolumnGrowth: NaN,
            annualSalesVolumn: NaN,
            impliedOperatingRate: NaN
        }
    }

    const annualSalesVolumn = Math.min(AnnualFactoryCapacity, prevYearSalesVolumn.annualSalesVolumn * (1 + salesVolumnGrowth.salesVolumnGrowthRate))

    return {
        year: currentYear,
        annualFactoryCapacity: AnnualFactoryCapacity,
        salesVolumnGrowth: salesVolumnGrowth.salesVolumnGrowthRate,
        annualSalesVolumn,
        impliedOperatingRate: annualSalesVolumn / AnnualFactoryCapacity
    }
}

const calcProjectedSalesVolumns = (initialSalesVolumn: SalesVolumn, scenarios: Scenarios): SalesVolumn[] => {
    return ProjectedYears.reduce<SalesVolumn[]>((acc,) => {
        return [
            ...acc,
            calcSalesVolumn(acc[acc.length - 1], scenarios)
        ]
    }, [initialSalesVolumn])
}

interface Revenue {
    year: number;
    grossRevenue: number;
    freightWarehousing: number;
    netRevenue: number;
}

const calcRevenue = (pricing: Pricing, salesVolumn: SalesVolumn): Revenue => {

    const grossRevenue = pricing.grossSalesPrice * salesVolumn.annualSalesVolumn
    const freightWarehousing = pricing.freightWarehousing * salesVolumn.annualSalesVolumn;
    const netRevenue = grossRevenue - freightWarehousing

    return {
        year: pricing.year,
        grossRevenue,
        freightWarehousing,
        netRevenue
    }
}

export const calcRevenueSchedule = (initialPricing: Pricing, initialSalesVolumn: SalesVolumn, scenarios: Scenarios) => {
    const projectedPricings = calcProjectedPricings(initialPricing, scenarios)
    const projectedSalesVolumns = calcProjectedSalesVolumns(initialSalesVolumn, scenarios)
    return projectedPricings.map((pricing, index) => {
        const salesVolumn = projectedSalesVolumns[index]
        return {
            pricing,
            salesVolumn,
            revenue: calcRevenue(pricing, salesVolumn)
        }
    })
}