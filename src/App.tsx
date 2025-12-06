import { useState } from 'react'


import { defaultCostInflationScenarioConfig, defaultSalesPriceScenarioConfig, defaultSalesVolumnGrowthScenarioConfig, type Scenario } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'
import { calcCostsSchedule } from './model/cost'
import { DefaultAssumption } from './model/assumption'
import { MM, StartProjectedYear } from './model/constant'
import { calcDepreciationSchedule } from './model/depreciation'
import { defaultStartYearAsset } from './model/balanceSheet'
import { RevenueScheduleUI } from './ui/RevenueScheduleUI'
import { calcIncomeTax } from './model/incomeTax'


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


  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <RevenueScheduleUI revenueSchedule={revenueSchedule} />
      <br />
      <pre>
        {JSON.stringify(costsSchedule, null, 4)}
      </pre>
      <pre>{JSON.stringify(depreciationSchedule, null, 4)}</pre>
      <pre>{JSON.stringify(calcIncomeTax({
        year: 2023,
        assumption: DefaultAssumption,
        accountingEBT: 57.4 * MM
      }), null, 4)}</pre>
    </div>
  )
}

export default App
