import { useState } from 'react'


import { defaultCostInflationScenarioConfig, defaultSalesPriceScenarioConfig, defaultSalesVolumnGrowthScenarioConfig, type Scenario } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'
import { calcCostsSchedule } from './model/cost'
import { DefaultAssumption } from './model/assumption'
import { MM, ProjectedYears, StartProjectedYear, StartYear } from './model/constant'
import { calcDepreciationSchedule } from './model/depreciation'
import { RevenueScheduleUI } from './ui/RevenueScheduleUI'
import { CostScheduleUI } from './ui/CostScheduleUI'
import { DepreciationUI } from './ui/DepreciationUI'
import { calcWorkingCapitalSchedule } from './model/workingCapital'
import { WorkingCapitalUI } from './ui/WorkingCapitalUI'
import { StartYearLananceSheet } from './data'

import { build, type FinancialStatement } from './model/build'


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
    initialCarryingValue: StartYearLananceSheet().asset.longTermAsset.netPPE,
    yearsRemainingForDepreciationOfExistingAssets: DefaultAssumption.depreciation.yearsRemainingForDepreciationOfExistingAssets,
    yearsUsedForDepreciationOfNewAssets: DefaultAssumption.depreciation.yearsUsedForDepreciationOfNewAssets,
    capitalExpenditure: DefaultAssumption.capitalExpenditure
  })

  const workingCapitalSchedule = calcWorkingCapitalSchedule({
    revenueSchedule,
    costs: [
      {
        year: StartYear,
        amount: 167.9 * MM
      },
      ...costsSchedule
    ],
    workingCapitalDays: DefaultAssumption.workingCapitalDays,
    historyBalanceSheet: [StartYearLananceSheet()]
  })


  let prevYearBalanceSheet = StartYearLananceSheet();

  const financialStatements: FinancialStatement[] = [];

  ProjectedYears.forEach((year) => {
    const financialStatement = build({
      year,
      assumption: DefaultAssumption,
      revenueSchedule,
      costInflationScenarioConfig: defaultCostInflationScenarioConfig,
      costsSchedule,
      scenario,
      workingCapitalSchedule,
      prevYearBalanceSheet,
      depreciationSchedule
    })

    prevYearBalanceSheet = financialStatement.balanceSheet;
    financialStatements.push(financialStatement)
  })


  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <RevenueScheduleUI revenueSchedule={revenueSchedule} />
      <CostScheduleUI costsSchedule={costsSchedule} />
      <DepreciationUI depreciationSchedule={depreciationSchedule} />
      <WorkingCapitalUI workingCapitalSchedule={workingCapitalSchedule} />
      <br />

      <pre>{JSON.stringify(financialStatements, null, 4)}</pre>
    </div>
  )
}

export default App
