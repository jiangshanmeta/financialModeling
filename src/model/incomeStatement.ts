
export interface IncomeStatement {
    year: number;
    gorssRevenue: number;
    freightWarehousing: number;
    netRevenue: number;

    COGS: number;
    "SG&A": number;
    totalCosts: number;

    costAdjustment: number;
    EBITDA: number;

    depreciation: number;
    EBIT: number;

    interestExpense: number;
    EBT: number;

    currentIncomeTax: number;
    deferredIncomeTax: number;
    totalIncomeTax: number;

    netIncome: number;
    
    EBITDAMargin: number;
    EBITMargin: number;
    ROE: number;
}