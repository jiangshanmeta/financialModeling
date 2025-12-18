import type { CashFlowStatement } from "../model/cashflowStatement";
import type { ColumnsType } from "antd/es/table";
import { formatMM } from "./util";
import { Table, Typography } from 'antd';
const { Title } = Typography;
const INDEX_FIELD = "indexField";

export const CashFlowStatementUI = ({
    cashFlowStatements,
}: {
    cashFlowStatements: CashFlowStatement[]
}) => {

    const years = [...new Set(cashFlowStatements.map(item => item.year))].sort((a, b) => a - b);

    const mergedCashFlow = cashFlowStatements.map((item) => {
        return {
            year: item.year,
            ...item.operating,
            ...item.investing,
            ...item.financing,
            changeInCashPosition: item.changeInCashPosition,
        }
    })

    const fields: Array<keyof (typeof mergedCashFlow)[number]> = [
        "netIncome",
        "depreciationAmotization",
        "deferredIncomeTaxes",
        "changesInWorkingCapital",
        "operatingCashFlow",
        "CAPEX",
        "otherInvestment",
        "investingCashFlow",
        "revolverIssuance",
        "termDebtIssuance",
        "commonSharesIssuance",
        "commonDividends",
        "financingCashFlow",
        "changeInCashPosition"
    ]

    const transformedCashFlow = fields.map((field) => {
        const data = mergedCashFlow.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record[field]
            }
        }, {});


        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field,
        }
    })

    const columnsCashFlowStatement = [
        {
            title: '',
            dataIndex: INDEX_FIELD,
            key: INDEX_FIELD,
            fixed: 'left',
            render: (value: string) => value,
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit",
            render: () => "($ MM)"
        },
        ...years.map((year) => {
            return {
                title: `${year}`,
                dataIndex: `${year}`,
                key: `${year}`,
                render: (value: number | undefined,) => {
                    if (typeof value === "number") {
                        return formatMM(value)
                    }
                    return null;
                },
                align: "right" as const,
            }
        })
    ]

    return (
        <div style={{ padding: 16 }}>
            <Title level={2} style={{ textAlign: "center", }}>
                CashFlow Statement
            </Title>

            <Table
                dataSource={transformedCashFlow}
                columns={columnsCashFlowStatement as ColumnsType<(typeof transformedCashFlow)[number]>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />
        </div>
    )

}
