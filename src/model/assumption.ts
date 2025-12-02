import { MM } from "./constant";

interface Costs {
    rawMaterials: number;
    utilities: number;
    rent: number;
    operatingLabour: number;
    other: number;
    "SG&A": number;
}



interface Assumption {
    costs: Costs
}

export const DefaultAssumption: Assumption = {
    costs: {
        rawMaterials: 226,
        utilities: 66.2,
        rent: 23.5 * MM,
        operatingLabour: 43.5 * MM,
        other: 2 * MM,
        "SG&A": 3.9 * MM,
    }
}