import type { ColumnsType } from "antd/es/table";
import type { IncomeStatement } from "../model/incomeStatement";
import { formatMM } from "./util";
import { Table, Typography } from 'antd';
const { Title } = Typography;
const INDEX_FIELD = "indexField";

export const IncomeStatementUI = ({ incometStatements }: { incometStatements: IncomeStatement[] }) => {
    const years = [...new Set(incometStatements.map(item => item.year))].sort((a, b) => a - b);

    const incomeStatementFields: Array<keyof IncomeStatement> = [
        "gorssRevenue",
        "freightWarehousing",
        "netRevenue",
        "COGS",
        "SG&A",
        "totalCosts",
        "costAdjustment",
        "EBITDA",
        "depreciation",
        "EBIT",
        "interestExpense",
        "EBT",
        "currentIncomeTax",
        "deferredIncomeTax",
        "totalIncomeTax",
        "netIncome"
    ]

    const transformedIncomestatement = incomeStatementFields.map((field) => {
        const data = incometStatements.reduce<Record<number, number>>((acc, record) => {
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

    const columnsIncomeStatement = [
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
                Income Statement
            </Title>

            <Title level={3}>Days In</Title>
            <Table
                dataSource={transformedIncomestatement}
                columns={columnsIncomeStatement as ColumnsType<(typeof transformedIncomestatement)[number]>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />
        </div>
    )

}