import { Select, } from 'antd';
import type { Scenario } from '../model/scenarios';
import { getScenarioText } from './util';

interface SelectScenarioProps {
    value: Scenario;
    onChange: (scenarios: Scenario) => void;
}

export const SelectScenario = ({
    value,
    onChange
}: SelectScenarioProps) => {
    return (
        <Select
            value={value}
            style={{ width: 120 }}
            onChange={onChange}
            options={[
                { value: "base", label: getScenarioText("base") },
                { value: 'best', label: getScenarioText("best") },
                { value: 'worst', label: getScenarioText("worst") },
            ]}
        />
    )
}