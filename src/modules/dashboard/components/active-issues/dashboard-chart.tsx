import { useMemo, useEffect, useState } from "react";


import { FilteredIssues } from "../../repositories/dashboard.repository";
import { Chart, ChartCategoryAxis, ChartCategoryAxisItem, ChartSeries, ChartSeriesDefaults, ChartSeriesItem, ChartTitle } from "@progress/kendo-react-charts";


export type DashboardChartProps = {
    issuesAll: FilteredIssues;
};

type ChartRefreshHandler = (
    chartOptions: Record<string, unknown>,
    themeOptions: Record<string, unknown>,
    chartInstance: {
      setOptions: (options: unknown, theme: unknown) => void;
    }
  ) => void;
  


export function DashboardChart(props: DashboardChartProps) {
    const [shouldRefreshChart, setShouldRefreshChart] = useState(true);

    function initCategories() {
        console.log('initCategories');
        const cats = props.issuesAll.categories ? props.issuesAll.categories.map(c => new Date(c)) : [];
        return cats;
    }


    useEffect(() => {
        setShouldRefreshChart(true);
    }, [props.issuesAll]);

    const handleChartRefresh: ChartRefreshHandler = (options, theme, chart) => {
        if (shouldRefreshChart) {
          chart.setOptions(options, theme);
          setShouldRefreshChart(false);
        }
      };
      

    function initItemsOpenedByMonth() {
        const itemsOpenByMonth: number[] = [];
        props.issuesAll.items.forEach((item, index) => {
            itemsOpenByMonth.push(item.open.length);
        });
        return itemsOpenByMonth;
    }

    function initItemsClosedByMonth() {
        const itemsClosedByMonth: number[] = [];
        props.issuesAll.items.forEach((item, index) => {
            itemsClosedByMonth.push(item.closed.length);
        });
        return itemsClosedByMonth;
    }

    const categories = useMemo(() => {
        return initCategories();
    },[props.issuesAll.categories]);

    const itemsOpenedByMonth = useMemo(() => {
        return initItemsOpenedByMonth();
    },[props.issuesAll.items]);

    const itemsClosedByMonth = useMemo(() => {
        return initItemsClosedByMonth();
    },[props.issuesAll.items]);

    return (

        <Chart onRefresh={handleChartRefresh}>
            <ChartTitle text="Active Issues" />

            <ChartSeriesDefaults type="column" stack={true} gap={0.06} />

            <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={categories} baseUnit="months" majorGridLines={{ visible: false }} labels={{ rotation: 'auto', margin: { top: 20 } }}></ChartCategoryAxisItem>
            </ChartCategoryAxis>

            <ChartSeries>
                <ChartSeriesItem data={itemsOpenedByMonth} opacity={0.7} color="#CC3458" />

                <ChartSeriesItem data={itemsClosedByMonth} opacity={0.7} color="#35C473" />
            </ChartSeries>
        </Chart>

    );
}
