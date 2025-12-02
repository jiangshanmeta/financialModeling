import { useState } from 'react'


import type { Scenarios } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'




function App() {
  const [scenario, setScenario] = useState<Scenarios>("base")

  const revenueSchedule = calcRevenueSchedule(StartYearPricing,StartYearSalesVolumn,scenario)

  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <pre>
      {
        JSON.stringify(revenueSchedule,null,4)
      }
      </pre>
    </div>
  )
}

export default App
