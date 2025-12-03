import { AnnualFactoryCapacity, KILO, ProjectedYears, StartYear } from "./constant";
import { type CostInflationScenarioConfig, type SalesPriceScenarioConfig, type SalesVolumnGrowthScenarioConfig, type Scenario } from "./scenarios";

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

const calcPricing = ({
    prevYearPricing,
    scenario,
    costInflationScenarioConfig,
    salesPriceScenarioConfig
}: {
    prevYearPricing: Pricing,
    scenario: Scenario,
    costInflationScenarioConfig: CostInflationScenarioConfig,
    salesPriceScenarioConfig: SalesPriceScenarioConfig
}): Pricing => {
    const currentYear = prevYearPricing.year + 1;
    const inflationConfig = costInflationScenarioConfig[scenario].find(item => item.year === currentYear);
    const salesPriceConfig = salesPriceScenarioConfig[scenario].find(item => item.year === currentYear);
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

const calcProjectedPricings = ({
    initialPricing,
    scenario,
    costInflationScenarioConfig,
    salesPriceScenarioConfig
}: {
    initialPricing: Pricing;
    scenario: Scenario;
    costInflationScenarioConfig: CostInflationScenarioConfig;
    salesPriceScenarioConfig: SalesPriceScenarioConfig

}): Pricing[] => {

    return ProjectedYears.reduce<Pricing[]>((acc) => {
        return [
            ...acc,
            calcPricing({
                prevYearPricing: acc[acc.length - 1],
                scenario,
                costInflationScenarioConfig,
                salesPriceScenarioConfig
            })
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

const calcSalesVolumn = ({
    prevYearSalesVolumn,
    scenario,
    salesVolumnGrowthScenarioConfig
}: {
    prevYearSalesVolumn: SalesVolumn;
    scenario: Scenario,
    salesVolumnGrowthScenarioConfig: SalesVolumnGrowthScenarioConfig
}): SalesVolumn => {
    const currentYear = prevYearSalesVolumn.year + 1
    const salesVolumnGrowth = salesVolumnGrowthScenarioConfig[scenario].find(item => item.year === currentYear)


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

const calcProjectedSalesVolumns = ({
    initialSalesVolumn,
    scenario,
    salesVolumnGrowthScenarioConfig
}: {
    initialSalesVolumn: SalesVolumn;
    scenario: Scenario;
    salesVolumnGrowthScenarioConfig: SalesVolumnGrowthScenarioConfig
}): SalesVolumn[] => {
    return ProjectedYears.reduce<SalesVolumn[]>((acc,) => {
        return [
            ...acc,
            calcSalesVolumn({
                prevYearSalesVolumn: acc[acc.length - 1],
                scenario,
                salesVolumnGrowthScenarioConfig
            })
        ]
    }, [initialSalesVolumn])
}

interface Revenue {
    year: number;
    grossRevenue: number;
    freightWarehousing: number;
    netRevenue: number;
}


const calcRevenue = ({
    pricing,
    salesVolumn
}: {
    pricing: Pricing;
    salesVolumn: SalesVolumn
}): Revenue => {

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

export interface RevenueSchedule {
    pricing: Pricing;
    salesVolumn: SalesVolumn;
    revenue: Revenue
}

export const calcRevenueSchedule = ({
    initialPricing,
    initialSalesVolumn,
    scenario,
    costInflationScenarioConfig,
    salesPriceScenarioConfig,
    salesVolumnGrowthScenarioConfig
}: {
    initialPricing: Pricing;
    initialSalesVolumn: SalesVolumn;
    scenario: Scenario;
    costInflationScenarioConfig: CostInflationScenarioConfig;
    salesPriceScenarioConfig: SalesPriceScenarioConfig;
    salesVolumnGrowthScenarioConfig: SalesVolumnGrowthScenarioConfig
}): RevenueSchedule[] => {
    const projectedPricings = calcProjectedPricings({
        initialPricing,
        scenario,
        costInflationScenarioConfig,
        salesPriceScenarioConfig
    })
    const projectedSalesVolumns = calcProjectedSalesVolumns({
        initialSalesVolumn,
        scenario,
        salesVolumnGrowthScenarioConfig
    })
    return projectedPricings.map((pricing, index) => {
        const salesVolumn = projectedSalesVolumns[index]
        return {
            pricing,
            salesVolumn,
            revenue: calcRevenue({ pricing, salesVolumn })
        }
    })
}