import type { RevenueSchedule } from "../model/revenue";
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Typography } from 'antd';

const { Title } = Typography;


import { formatDecimal, formatKILO, formatMM, formatPercent } from "./util";

type PricingKeys = keyof RevenueSchedule['pricing']
type SalesVolumnKeys = keyof RevenueSchedule['salesVolumn']
type RevenueKeys = keyof RevenueSchedule["revenue"]

const pricingUnitMap: Record<PricingKeys, string> = {
    year: "",
    costInflation: "(%)",
    grossSalesPrice: "($/unit)",
    freightWarehousing: "($/unit)",
    netSalesPrice: "($/unit)"
}

const salesVolumnUnitMap: Record<SalesVolumnKeys, string> = {
    year: "",
    annualFactoryCapacity: "(000's units)",
    salesVolumnGrowth: "(%)",
    annualSalesVolumn: "(000's units)",
    impliedOperatingRate: ""
}

const revenueUnitMap: Record<RevenueKeys, string> = {
    year: "",
    freightWarehousing: "($ MM)",
    grossRevenue: "($ MM)",
    netRevenue: "($ MM)"
}

const pricingLabelMap: Record<PricingKeys, string> = {
    year: "",
    costInflation: "Cost Inflation",
    grossSalesPrice: "Gross Sales Price",
    freightWarehousing: "Freight & Warehousing",
    netSalesPrice: "Net Sales Price"
}

const salesVolumnLabelMap: Record<SalesVolumnKeys, string> = {
    year: "",
    annualFactoryCapacity: "Annual Factory Capacity",
    salesVolumnGrowth: "Sales Volumn Growth",
    annualSalesVolumn: "Annual Sales Volumn",
    impliedOperatingRate: "Implied Operating Rate"
}

const revenueLabelMap: Record<RevenueKeys, string> = {
    year: "",
    freightWarehousing: "Gross Revenue",
    grossRevenue: "Freight & Warehousing",
    netRevenue: "Net Revenue"
}

const IndexField = "indexField"


export const RevenueScheduleUI = ({ revenueSchedule }: { revenueSchedule: RevenueSchedule[] }) => {
    const years = [...new Set(revenueSchedule.map(item => item.year))].sort((a, b) => a - b);
    const pricingFields: PricingKeys[] = [
        "grossSalesPrice",
        "costInflation",
        "freightWarehousing",
        "netSalesPrice"
    ]

    const pricingTransformedData = pricingFields.map((field) => {
        const data = revenueSchedule.map(item => item.pricing).reduce<Record<number, number>>((acc, pricing) => {
            return {
                ...acc,
                [pricing.year]: pricing[field]
            }

        }, {});

        return {
            ...data,
            unit: pricingUnitMap[field],
            [IndexField]: field
        }
    })

    const pricingColumns: TableProps<(typeof pricingTransformedData)[number]>['columns'] = [
        {
            title: '',
            dataIndex: IndexField,
            key: IndexField,
            fixed: 'left',
            render: (value: PricingKeys) => {

                return pricingLabelMap[value]
            },
        },
        {
            title: "",
            dataIndex: "unit",
            key: "unit",
        },
        ...years.map(year => ({
            title: `${year}`,
            dataIndex: year,
            key: year,
            render: (value: number, _: (typeof pricingTransformedData)[number], index: number) => {

                if (pricingFields[index] === "costInflation") {
                    if (year === years[0]) {
                        return null;
                    }
                    return formatPercent(value)
                }
                return formatDecimal(value);
            },
            align: "right" as const,

        })),
    ];

    const salesValumnFields: SalesVolumnKeys[] = [
        "annualFactoryCapacity",
        "salesVolumnGrowth",
        "annualSalesVolumn",
        "impliedOperatingRate"
    ]
    const salesVolumnTransformedData = salesValumnFields.map((field) => {
        const data = revenueSchedule.map(item => item.salesVolumn).reduce<Record<number, number>>((acc, pricing) => {
            return {
                ...acc,
                [pricing.year]: pricing[field]
            }

        }, {});

        return {
            ...data,
            unit: salesVolumnUnitMap[field],
            [IndexField]: field
        }
    })

    const salesVolumnColumns: TableProps<(typeof salesVolumnTransformedData)[number]>['columns'] = [
        {
            title: '',
            dataIndex: IndexField,
            key: IndexField,
            fixed: 'left',
            render: (value: SalesVolumnKeys) => {

                return salesVolumnLabelMap[value]
            },
        },
        {
            title: "",
            dataIndex: "unit",
            key: "unit",
        },
        ...years.map(year => ({
            title: `${year}`,
            dataIndex: year,
            key: year,
            render: (value: number, _: (typeof salesVolumnTransformedData)[number], index: number) => {

                if (salesValumnFields[index] === "salesVolumnGrowth" || salesValumnFields[index] === "impliedOperatingRate") {
                    if (year === years[0]) {
                        return null;
                    }
                    return formatPercent(value)
                }
                return formatKILO(value);
            },
            align: "right" as const,

        })),
    ];

    const revenueFields: RevenueKeys[] = [
        "grossRevenue",
        "freightWarehousing",
        "netRevenue"

    ]

    const revenueTransformedData = revenueFields.map((field) => {
        const data = revenueSchedule.map(item => item.revenue).reduce<Record<number, number>>((acc, pricing) => {
            return {
                ...acc,
                [pricing.year]: pricing[field]
            }

        }, {});

        return {
            ...data,
            unit: revenueUnitMap[field],
            [IndexField]: field
        }
    })

    const revenueColumns: TableProps<(typeof revenueTransformedData)[number]>['columns'] = [
        {
            title: '',
            dataIndex: IndexField,
            key: IndexField,
            fixed: 'left',
            render: (value: RevenueKeys) => {

                return revenueLabelMap[value]
            },
        },
        {
            title: "",
            dataIndex: "unit",
            key: "unit",
        },
        ...years.map(year => ({
            title: `${year}`,
            dataIndex: year,
            key: year,
            render: (value: number) => {
                return formatMM(value);
            },
            align: "right" as const,

        })),
    ];


    return (
        <div>
            <Title level={2} style={{ textAlign: "center" }}>Revenue Schedule</Title>
            <Title level={3}>Pricing</Title>
            <Table
                dataSource={pricingTransformedData}
                columns={pricingColumns}
                pagination={false}
            />
            <Title level={3}>Sales Volumn</Title>
            <Table
                dataSource={salesVolumnTransformedData}
                columns={salesVolumnColumns}
                pagination={false}
            />
            <Title level={3}>Revenue</Title>
            <Table
                dataSource={revenueTransformedData}
                columns={revenueColumns}
                pagination={false}
            />
        </div>



    )

}