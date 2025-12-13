import { Table, Typography } from 'antd';
import { formatDecimal, formatMM } from "./util";
import type { ColumnsType } from 'antd/es/table';
import type { WorkingCapitalBalanceSheet, WorkingCapitalSchedule } from '../model/workingCapital';
import type { WorkingCapitalDays } from '../model/assumption';
const { Title } = Typography;
const INDEX_FIELD = "indexField";


export const WorkingCapitalUI = ({
    workingCapitalSchedule
}: {
    workingCapitalSchedule: WorkingCapitalSchedule[]
}) => {
    const years = [...new Set(workingCapitalSchedule.map(item => item.year))].sort((a, b) => a - b);

    const daysInFields: Array<keyof WorkingCapitalDays> = [
        "accountsReceivable",
        "inventories",
        "prepaidExpenses",
        "otherAssets",
        "accountsPayable",
        "otherLiabilities"
    ]
    const transformedDaysIn = daysInFields.map((field) => {
        const data = workingCapitalSchedule.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record.workingCapitalDays[field]
            }
        }, {});


        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field,
        }
    })

    const columnsDaysIn = [
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
            render: () => "(days)"
        },
        ...years.map((year) => {
            return {
                title: `${year}`,
                dataIndex: `${year}`,
                key: `${year}`,
                render: (value: number | undefined,) => {
                    if (typeof value === "number") {
                        return formatDecimal(value)
                    }
                    return null;
                },
                align: "right" as const,
            }
        })
    ]

    const balanceSheetFields: Array<keyof WorkingCapitalBalanceSheet> = [
        "accountsReceivable",
        "inventories",
        "prepaidExpenses",
        "otherAssets",
        "accountsPayable",
        "otherLiabilities",
        "netWorkingCapital",
    ]

    const transformedBalanceSheet = balanceSheetFields.map((field) => {
        const data = workingCapitalSchedule.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record.balanceSheet[field]
            }
        }, {});


        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field,
        }
    })

    const columnsBalanceSheet = [
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
                Cost Schedule
            </Title>

            <Title level={3}>Days In</Title>
            <Table
                dataSource={transformedDaysIn}
                columns={columnsDaysIn as ColumnsType<(typeof transformedDaysIn)[number]>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />

            <Title level={3}>Account Balances</Title>
            <Table
                dataSource={transformedBalanceSheet}
                columns={columnsBalanceSheet as ColumnsType<(typeof transformedBalanceSheet)[number]>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />
        </div>
    )

}