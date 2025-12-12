import type { RevenueSchedule } from "../model/revenue";
import { Divider, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatDecimal, formatKILO, formatMM, formatPercent } from "./util";

const { Title } = Typography;

const INDEX_FIELD = "indexField";

type SectionData<T extends string> = {
  [INDEX_FIELD]: T;
  unit: string;
} & Record<number, number>;

interface SectionConfig<T extends string> {
  fields: T[];
  unitMap: Record<T, string>;
  labelMap: Record<T, string>;
  dataExtractor: (item: RevenueSchedule) => Record<T, number> & { year: number };
  valueFormatter: (value: number, field: T, year: number, firstYear: number) => React.ReactNode;
}


type PricingKeys = keyof RevenueSchedule['pricing'];
type SalesVolumeKeys = keyof RevenueSchedule['salesVolumn'];
type RevenueKeys = keyof RevenueSchedule["revenue"];


const formatValue = {
  percent: (value: number, year: number, firstYear: number): React.ReactNode =>
    year === firstYear ? null : formatPercent(value),
  decimal: (value: number): React.ReactNode => formatDecimal(value),
  kilo: (value: number): React.ReactNode => formatKILO(value),
  mm: (value: number): React.ReactNode => formatMM(value),
};

const pricingConfig: SectionConfig<PricingKeys> = {
  fields: ["grossSalesPrice", "costInflation", "freightWarehousing", "netSalesPrice"],
  unitMap: {
    year: "",
    costInflation: "(%)",
    grossSalesPrice: "($/unit)",
    freightWarehousing: "($/unit)",
    netSalesPrice: "($/unit)"
  },
  labelMap: {
    year: "",
    costInflation: "Cost Inflation",
    grossSalesPrice: "Gross Sales Price",
    freightWarehousing: "Freight & Warehousing",
    netSalesPrice: "Net Sales Price"
  },
  dataExtractor: (item) => item.pricing,
  valueFormatter: (value, field, year, firstYear) =>
    field === "costInflation"
      ? formatValue.percent(value, year, firstYear)
      : formatValue.decimal(value)
};

const salesVolumeConfig: SectionConfig<SalesVolumeKeys> = {
  fields: ["annualFactoryCapacity", "salesVolumnGrowth", "annualSalesVolumn", "impliedOperatingRate"],
  unitMap: {
    year: "",
    annualFactoryCapacity: "(000's units)",
    salesVolumnGrowth: "(%)",
    annualSalesVolumn: "(000's units)",
    impliedOperatingRate: ""
  },
  labelMap: {
    year: "",
    annualFactoryCapacity: "Annual Factory Capacity",
    salesVolumnGrowth: "Sales Volumn Growth",
    annualSalesVolumn: "Annual Sales Volumn",
    impliedOperatingRate: "Implied Operating Rate"
  },
  dataExtractor: (item) => item.salesVolumn,
  valueFormatter: (value, field, year, firstYear) => {
    if (field === "salesVolumnGrowth" || field === "impliedOperatingRate") {
      return formatValue.percent(value, year, firstYear);
    }
    return formatValue.kilo(value);
  }
};

const revenueConfig: SectionConfig<RevenueKeys> = {
  fields: ["grossRevenue", "freightWarehousing", "netRevenue"],
  unitMap: {
    year: "",
    freightWarehousing: "($ MM)",
    grossRevenue: "($ MM)",
    netRevenue: "($ MM)"
  },
  labelMap: {
    year: "",
    freightWarehousing: "Gross Revenue",
    grossRevenue: "Freight & Warehousing",
    netRevenue: "Net Revenue"
  },
  dataExtractor: (item) => item.revenue,
  valueFormatter: (value) => formatValue.mm(value)
};


const transformData = <T extends string>(
  revenueSchedule: RevenueSchedule[],
  config: SectionConfig<T>
): SectionData<T>[] => {
  return config.fields.map((field) => {
    const data = revenueSchedule.reduce<Record<number, number>>((acc, item) => {
      const sectionData = config.dataExtractor(item);
      return { ...acc, [sectionData.year]: sectionData[field] };
    }, {});

    return {
      ...data,
      unit: config.unitMap[field],
      [INDEX_FIELD]: field
    };
  });
};


const generateColumns = <T extends string>(
  years: number[],
  config: SectionConfig<T>
): ColumnsType<SectionData<T>> => {
  const firstYear = years[0];

  return [
    {
      title: '',
      dataIndex: INDEX_FIELD,
      key: INDEX_FIELD,
      fixed: 'left',
      render: (value: T) => config.labelMap[value]
    },
    {
      title: "",
      dataIndex: "unit",
      key: "unit",
    },
    ...years.map(year => ({
      title: `${year}`,
      dataIndex: `${year}`,
      key: `${year}`,
      render: (value: number, record: SectionData<T>) => {
        const field = record[INDEX_FIELD];
        return config.valueFormatter(value, field, year, firstYear);
      },
      align: "right" as const,
    }))
  ];
};


const RevenueSectionTable = <T extends string>({
  title,
  revenueSchedule,
  config
}: {
  title: string;
  revenueSchedule: RevenueSchedule[];
  config: SectionConfig<T>;
}) => {
  const years = [...new Set(revenueSchedule.map(item => item.year))].sort((a, b) => a - b);
  const transformedData = transformData(revenueSchedule, config);
  const columns = generateColumns(years, config);

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={3}>{title}</Title>
      <Table<SectionData<T>>
        dataSource={transformedData}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey={record => record[INDEX_FIELD]}
        size="small"
      />
    </div>
  );
};


export const RevenueScheduleUI = ({ revenueSchedule }: { revenueSchedule: RevenueSchedule[] }) => {
  return (
    <div style={{ padding: 16 }}>
      <Title level={2} style={{ textAlign: "center", }}>
        Revenue Schedule
      </Title>
      <Divider/>

      <RevenueSectionTable<PricingKeys>
        title="Pricing"
        revenueSchedule={revenueSchedule}
        config={pricingConfig}
      />

      <RevenueSectionTable<SalesVolumeKeys>
        title="Sales Volume"
        revenueSchedule={revenueSchedule}
        config={salesVolumeConfig}
      />

      <RevenueSectionTable<RevenueKeys>
        title="Revenue"
        revenueSchedule={revenueSchedule}
        config={revenueConfig}
      />
    </div>
  );
};