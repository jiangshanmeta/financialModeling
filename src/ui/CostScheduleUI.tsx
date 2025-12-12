import type { Costs, FixedCosts, VariableCosts } from "../model/cost";
import { Divider, Table, Typography } from 'antd';
import { formatMM } from "./util";
import type { ColumnsType } from 'antd/es/table';
const { Title } = Typography;


const INDEX_FIELD = "indexField";
type SectionData<T extends string> = {
    [INDEX_FIELD]: T;
    unit: string;
} & Record<number, number>;

export const CostScheduleUI = ({ costsSchedule }: { costsSchedule: Costs[] }) => {

    const years = [...new Set(costsSchedule.map(item => item.year))].sort((a, b) => a - b);

    const variableCostFields: Array<keyof VariableCosts> = ["rawMaterials", "utilities", "totalVariableCosts"]

    const transformedVariableCosts = variableCostFields.map((field) => {
        const data = costsSchedule.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record.costsInTotal.variableCosts[field]
            }
        }, {});

        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field
        }
    })

    const fixedCostFields: Array<keyof FixedCosts> = ["rent", "operatingLabour", "other", "totalFixedCosts"]

    const transformedFixedCosts = fixedCostFields.map((field) => {
        const data = costsSchedule.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record.costsInTotal.fixedCosts[field]
            }
        }, {});

        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field
        }
    })

    const totalCostFields = ["totalCosts"] as const;

    const transformedTotalCosts = totalCostFields.map((field) => {
        const data = costsSchedule.reduce<Record<number, number>>((acc, record) => {
            return {
                ...acc,
                [record.year]: record.costsInTotal[field]
            }
        }, {});

        return {
            ...data,
            unit: "",
            [INDEX_FIELD]: field
        }
    })


    const columns = [
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
        ...years.map(year => ({
            title: `${year}`,
            dataIndex: `${year}`,
            key: `${year}`,
            render: (value: number,) => {
                return formatMM(value);
            },
            align: "right" as const,
        }))

    ]





    return (
        <div style={{ padding: 16 }}>
            <Title level={2} style={{ textAlign: "center", }}>
                Cost Schedule
            </Title>
            <Divider />

            <Title level={3}>Costs In Total</Title>
            <Title level={4}>Variable Costs</Title>
            <Table
                dataSource={transformedVariableCosts}
                columns={columns as ColumnsType<SectionData<keyof VariableCosts>>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />

            <Title level={4}>Fixed Costs</Title>
            <Table
                dataSource={transformedFixedCosts}
                columns={columns as ColumnsType<SectionData<keyof FixedCosts>>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />

            <Title level={4}>Total Costs</Title>
            <Table
                dataSource={transformedTotalCosts}
                columns={columns as ColumnsType<SectionData<"totalCosts">>}
                pagination={false}
                scroll={{ x: 'max-content' }}
                rowKey={record => record[INDEX_FIELD]}
                size="small"
            />
        </div>
    )

}