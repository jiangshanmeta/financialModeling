import type { DepreciationSchedule } from "../model/depreciation"

import { Table, Typography } from 'antd';
import { formatMM } from "./util";
import type { ColumnsType } from 'antd/es/table';
const { Title } = Typography;
const INDEX_FIELD = "indexField";

export const DepreciationUI = ({ depreciationSchedule }: {
    depreciationSchedule: DepreciationSchedule
}) => {
    const years = [...new Set(depreciationSchedule.aggregateDepreciation.map(item => item.year))].sort((a, b) => a - b);

    const CAPEX = years.map((year) => {

        return {
            ...depreciationSchedule.fromNewAsset.filter(item => item.assetInvestYear === year).reduce<Record<number, number>>((acc, item) => {
                return {
                    ...acc,
                    [item.depreciationYear]: item.amount
                }
            }, {}),
            [INDEX_FIELD]: `CAPEX ${year}`,
        }
    })

    const data = [
        {
            ...depreciationSchedule.fromExistingAsset.reduce<Record<number, number>>((acc, item) => {
                return {
                    ...acc,
                    [item.depreciationYear]: item.amount
                }

            }, {}),
            [INDEX_FIELD]: "Depreciation to Existing Assets"
        },

        ...CAPEX,
        {
            ...depreciationSchedule.aggregateDepreciation.reduce<Record<number, number>>((acc, item) => {

                return {
                    ...acc,
                    [item.year]: item.carryingAmount,
                }
            }, {}),

            [INDEX_FIELD]: "totalDepreciation"
        }
    ]

    const columns = [
        {
            title: '',
            dataIndex: INDEX_FIELD,
            key: INDEX_FIELD,
            fixed: 'left',
            render: (value: string) => value,
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
        <div
            style={{ padding: 16 }}
        >
            <Title level={2} style={{ textAlign: "center", }}>
                Depreciation Schedule
            </Title>
            <Table
                dataSource={data}
                columns={columns as ColumnsType<(typeof data)[number]>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />

        </div>

    )

}