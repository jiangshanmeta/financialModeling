import { useState } from 'react'


import { defaultCostInflationScenarioConfig, defaultSalesPriceScenarioConfig, defaultSalesVolumnGrowthScenarioConfig, type Scenario } from './model/scenarios'
import { SelectScenario } from './ui/SelectScenario'
import { calcRevenueSchedule, StartYearPricing, StartYearSalesVolumn } from './model/revenue'
import { calcCostsSchedule } from './model/cost'
import { DefaultAssumption } from './model/assumption'
import { MM, StartProjectedYear, StartYear } from './model/constant'
import { calcDepreciationSchedule } from './model/depreciation'
import { RevenueScheduleUI } from './ui/RevenueScheduleUI'
import { CostScheduleUI } from './ui/CostScheduleUI'
import { DepreciationUI } from './ui/DepreciationUI'
import { calcWorkingCapitalSchedule } from './model/workingCapital'
import { WorkingCapitalUI } from './ui/WorkingCapitalUI'
import { createIncomeStatement } from './model/incomeStatement'
import { StartYearLananceSheet } from './data'
import { createCashFlowStatement } from './model/cashflowStatement'
import { predicateBalanceSheet } from './model/balanceSheet'


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


  const startProjectedYearIncomeStatement = createIncomeStatement({
    revenueSchedule: revenueSchedule[1],
    costs: costsSchedule[0],
    year: StartProjectedYear,
    assumption: DefaultAssumption,
    costInflationScenarioConfig: defaultCostInflationScenarioConfig,
    scenario,
    prevYear: {
      cash: 0.3 * MM,
      revolver: 0 * MM,
      seniorSecuredTermDebt: 200 * MM,
    },
    depreciationSchedule,
  })


  const startProjectedYearCashflowStatement = createCashFlowStatement({
    assumption: DefaultAssumption,
    year: StartProjectedYear,
    preYearBalanceSheet: StartYearLananceSheet(),
    incomeStatement: startProjectedYearIncomeStatement,
    workingCapitalSchedule,
  })

  const startProjectedYearBalanceSheet = predicateBalanceSheet({
    year: StartProjectedYear,
    prevYearBalanceSheet: StartYearLananceSheet(),
    incomeStatement: startProjectedYearIncomeStatement,
    cashFlowStatement: startProjectedYearCashflowStatement,
    workingCapitalSchedule: workingCapitalSchedule[1],
  })

  return (
    <div>
      <SelectScenario value={scenario} onChange={setScenario} />
      <RevenueScheduleUI revenueSchedule={revenueSchedule} />
      <CostScheduleUI costsSchedule={costsSchedule} />
      <DepreciationUI depreciationSchedule={depreciationSchedule} />
      <WorkingCapitalUI workingCapitalSchedule={workingCapitalSchedule} />
      <br />

      <pre>{JSON.stringify(startProjectedYearIncomeStatement, null, 4)}</pre>

      <pre>{JSON.stringify(startProjectedYearCashflowStatement, null, 4)}</pre>

      <pre>{JSON.stringify(startProjectedYearBalanceSheet, null, 4)}</pre>
    </div>
  )
}

export default App
