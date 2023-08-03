import { Chart, ChartCategoryAxis, ChartCategoryAxisItem, ChartSeries, ChartSeriesDefaults, ChartSeriesItem, ChartTitle } from "@progress/kendo-react-charts";
import { FilteredIssues } from "../../repositories/dashboard.repository";

import 'hammerjs';
import { useMemo } from "react";

export type DashboardChartProps = {
    issuesAll: FilteredIssues;
};


export function DashboardChart(props: DashboardChartProps) {

    function initCategories() {
        console.log('initCategories');
        const cats = props.issuesAll.categories ? props.issuesAll.categories.map(c => new Date(c)) : [];
        return cats;
    }

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

        <Chart transitions={false}>
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
