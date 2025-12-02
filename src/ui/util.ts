import type { Scenarios } from "../model/scenarios";

const ScenarioTextMap: Record<Scenarios, string> = {
    base: "Base Case",
    best: "Best Case",
    worst: "Worst Case"
}

export const getScenarioText = (scenarios: Scenarios) => {
    return ScenarioTextMap[scenarios]
}