import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { process, State } from "@progress/kendo-data-query";
import { Grid, GridColumn, GridDataStateChangeEvent, GridRowClickEvent } from "@progress/kendo-react-grid";

import { ItemType } from "../../../../core/constants";
import { PtItem } from "../../../../core/models/domain";
import { getIndicatorClass } from "../../../../shared/helpers/priority-styling";


export type BacklogGridProps = {
    items: PtItem[];
};

export function BacklogGrid(props: BacklogGridProps) {

    const navigate = useNavigate();

    // Grid related

    const [gridState, setGridState] = useState<State>({
        skip: 0,
        take: 10,
        sort: [],
        group: []
    });

    function onDataStateChange(e: GridDataStateChangeEvent) {
        setGridState(e.dataState);
    }

    function onSelectionChange(args: GridRowClickEvent) {
        const selItem = args.dataItem as PtItem;
        navigate(`/detail/${selItem.id}`);
    }

    function getIndicatorImage(item: PtItem) {
        return ItemType.imageResFromType(item.type);
    }

    function getPriorityClass(item: PtItem): string {
        const indicatorClass = getIndicatorClass(item.priority);
        return indicatorClass;
    }
    



    const gridData = process(props.items, gridState);

    return (
        <Grid data={gridData} style={{ height: '400px' }} onRowClick={onSelectionChange}
            take={gridState.take}
            skip={gridState.skip}

            //skip={this.state.skip}
            //take={this.state.take}
            //total={this.state.items.length}
            pageable={true}
            //onPageChange={(e) => this.onPageChange(e)}
            sortable={true}
            //sort={this.state.sort}
            //onSortChange={(e) => this.onSortChange(e)}
            sort={gridState.sort}
            onDataStateChange={onDataStateChange}
        >
            <GridColumn field="type" title=" " width={40}
                cell={(props) => (
                    <td>
                        <img src={getIndicatorImage(props.dataItem)} className="backlog-icon" />
                    </td>
                )} />

            <GridColumn field="assignee" title="Assignee" width={260}
                cell={(props) => (
                    <td>
                        <div>
                            <img src={props.dataItem.assignee.avatar} className="li-avatar rounded mx-auto" />
                            <span style={{ marginLeft: 10 }}>{props.dataItem.assignee.fullName}</span>
                        </div>
                    </td>
                )} />

            <GridColumn field="title" title="Title" />

            <GridColumn field="priority" title="Priority" width={100}
                cell={(props) => (
                    <td>
                        <span className={'badge ' + getPriorityClass(props.dataItem)}>{props.dataItem.priority}</span>
                    </td>
                )} />

            <GridColumn field="estimate" title="Estimate" width={100} />

            <GridColumn field="dateCreated" title="Created" width={160} filter="date"
                cell={(props) => (
                    <td>
                        <span className="li-date">{props.dataItem.dateCreated.toDateString()}</span>
                    </td>
                )}
            />

        </Grid>


    );
}