import { useState } from 'react'


import { defaultCostInflationScenarioConfig, defaultSalesPriceScenarioConfig, defaultSalesVolumnGrowthScenarioConfig, type Scenario } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'


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

  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <pre>
        {
          JSON.stringify(revenueSchedule, null, 4)
        }
      </pre>
    </div>
  )
}

export default App
