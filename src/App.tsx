import { useState } from 'react'


import { defaultCostInflationScenarioConfig, defaultSalesPriceScenarioConfig, defaultSalesVolumnGrowthScenarioConfig, type Scenario } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'
import { calcCostsSchedule } from './model/cost'
import { DefaultAssumption } from './model/assumption'
import { MM, StartProjectedYear, StartYear } from './model/constant'
import { calcDepreciationSchedule } from './model/depreciation'
import { defaultStartYearAsset, defaultStartYearBalanceSheet } from './model/balanceSheet'
import { RevenueScheduleUI } from './ui/RevenueScheduleUI'
import { calcIncomeTax } from './model/incomeTax'
import { CostScheduleUI } from './ui/CostScheduleUI'
import { DepreciationUI } from './ui/DepreciationUI'
import { calcWorkingCapitalSchedule } from './model/workingCapital'
import { WorkingCapitalUI } from './ui/WorkingCapitalUI'


function App() {
  const [scenario, setScenario] = useState<Scenario>("base")

  const revenueSchedule = calcRevenueSchedule({
    initialPricing: StartYearPricing,
    initialSalesVolumn: StartYearSalesVolumn,
    scenario,
    costInflationScenarioConfig: defaultCostInflationScenarioConfig,
    salesPriceScenarioConfig: defaultSalesPriceScenarioConfig,
    salesVolumnGrowthScenarioConfig: defaultSalesVolumnGrowthScenarioConfig
  })

  const costsSchedule = calcCostsSchedule({
    revenueSchedule: revenueSchedule.slice(1),
    scenario,
    assumption: DefaultAssumption,
    startProjectedYear: StartProjectedYear,
    costInflationScenarioConfig: defaultCostInflationScenarioConfig

  })

  const depreciationSchedule = calcDepreciationSchedule({
    initialCarryingValue: defaultStartYearAsset.longTermAsset.netPPE,
    yearsRemainingForDepreciationOfExistingAssets: DefaultAssumption.depreciation.yearsRemainingForDepreciationOfExistingAssets,
    yearsUsedForDepreciationOfNewAssets: DefaultAssumption.depreciation.yearsUsedForDepreciationOfNewAssets,
    capitalExpenditure: DefaultAssumption.capitalExpenditure
  })

  const workingCapitalSchedule = calcWorkingCapitalSchedule({
    revenueSchedule,
    costs: [
      {
        year: StartYear,
        costsPerUnit: {
          year: 0,
          variableCosts: {
            year: 0,
            rawMaterials: 0,
            utilities: 0,
            totalVariableCosts: 0
          },
          fixedCosts: {
            year: 0,
            rent: 0,
            operatingLabour: 0,
            other: 0,
            totalFixedCosts: 0
          },
          totalCosts: 0
        },
        costsInTotal: {
          year: 0,
          variableCosts: {
            year: 0,
            rawMaterials: 0,
            utilities: 0,
            totalVariableCosts: 0
          },
          fixedCosts: {
            year: 0,
            rent: 0,
            operatingLabour: 0,
            other: 0,
            totalFixedCosts: 0
          },
          totalCosts: 167.9 * MM,
        }
      },

      ...costsSchedule
    ],
    workingCapitalDays: DefaultAssumption.workingCapitalDays,
    historyBalanceSheet: [defaultStartYearBalanceSheet]
  })


  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <RevenueScheduleUI revenueSchedule={revenueSchedule} />
      <CostScheduleUI costsSchedule={costsSchedule} />
      <DepreciationUI depreciationSchedule={depreciationSchedule} />
      <WorkingCapitalUI workingCapitalSchedule={workingCapitalSchedule} />
      <br />

      <pre>{JSON.stringify(calcIncomeTax({
        year: 2023,
        assumption: DefaultAssumption,
        accountingEBT: 57.4 * MM
      }), null, 4)}</pre>
    </div>
  )
}

export default App
