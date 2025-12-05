import type { Scenario } from "../model/scenarios";

const ScenarioTextMap: Record<Scenario, string> = {
    base: "Base Case",
    best: "Best Case",
    worst: "Worst Case"
}

export const getScenarioText = (scenarios: Scenario) => {
    return ScenarioTextMap[scenarios]
}