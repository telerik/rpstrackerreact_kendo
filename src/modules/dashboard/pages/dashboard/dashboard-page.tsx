import { cloneElement, useContext, useState } from "react";
import { useQueries } from "react-query";
import { Observable } from "rxjs";
import { Typography } from "@progress/kendo-react-common";

import {
  DashboardFilter,
  FilteredIssues,
} from "../../repositories/dashboard.repository";
import { formatDateEnUs } from "../../../../core/helpers/date-utils";
import { ActiveIssuesComponent } from "../../components/active-issues/active-issues";
import { StatusCounts } from "../../models";
import { PtUser } from "../../../../core/models/domain";
import {
  PtDashboardServiceContext,
  PtStoreContext,
  PtUserServiceContext,
} from "../../../../App";
import { DashboardChart } from "../../components/active-issues/dashboard-chart";

import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { ComboBox, ComboBoxChangeEvent } from "@progress/kendo-react-dropdowns";

type DateRange = {
  dateStart: Date;
  dateEnd: Date;
};

export function DashboardPage() {
  const store = useContext(PtStoreContext);
  const userService = useContext(PtUserServiceContext);
  const dashboardService = useContext(PtDashboardServiceContext);

  const [filter, setFilter] = useState<DashboardFilter>({});

  const users$: Observable<PtUser[]> = store.select<PtUser[]>("users");
  const [users, setUsers] = useState<PtUser[]>([]);

  function getQueryKey(keybase: string) {
    return [keybase, filter];
  }

  const useDashboardData = (filter: DashboardFilter) => {
    return useQueries<[StatusCounts, FilteredIssues]>([
      {
        queryKey: getQueryKey("items"),
        queryFn: () => dashboardService.getStatusCounts(filter),
      },
      {
        queryKey: getQueryKey("issues"),
        queryFn: () => dashboardService.getFilteredIssues(filter),
      },
    ]);
  };

  const queryResults = useDashboardData(filter);
  const queryResult0 = queryResults[0];
  const queryResult1 = queryResults[1];
  const statusCounts = queryResult0.data as StatusCounts;
  const filteredIssues = queryResult1.data as FilteredIssues;

  function onMonthRangeTap(months: number) {
    const range = getDateRange(months);
    setFilter({
      userId: filter.userId,
      dateEnd: range.dateEnd,
      dateStart: range.dateStart,
    });
  }

  function getDateRange(months: number): DateRange {
    const now = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    return {
      dateStart: start,
      dateEnd: now,
    };
  }

  function userFilterOpen() {
    users$.subscribe((users: PtUser[]) => {
      if (users.length > 0) {
        setUsers(users);
      }
    });

    userService.fetchUsers();
  }

  function filterItemRender(li: any, itemProps: any) {
    const userItem = itemProps.dataItem as PtUser;
    const renderedRow = (
      <div className="row" style={{ marginLeft: 5 }}>
        <img
          className="li-avatar rounded mx-auto d-block"
          src={userItem.avatar}
        />
        <span style={{ marginLeft: 5 }}>{userItem.fullName}</span>
      </div>
    );
    return cloneElement(li, li.props, renderedRow);
  }

  function userFilterValueChange(e: ComboBoxChangeEvent) {
    const user = e.target.value;
    if (user) {
      setFilter({ ...filter, userId: user.id });
    } else {
      setFilter({ ...filter, userId: undefined });
    }
  }

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <div className="col-md order-md-first text-center text-md-left">
          <div >
            <Typography.h2 className="small text-uppercase text-muted mb-0">
              Statistics
            </Typography.h2>
            {filter.dateStart && filter.dateEnd && (
              <span>
                {" "}
                {formatDateEnUs(filter.dateStart)} -{" "}
                {formatDateEnUs(filter.dateEnd)}
              </span>
            )}
          </div>
        </div>

        <div className="btn-toolbar mb-2 mb-md-0" style={{ gap: 20 }}>
          <ComboBox
            data={users}
            itemRender={filterItemRender}
            placeholder={"Select Assignee..."}
            textField="fullName"
            dataItemKey="id"
            onOpen={userFilterOpen}
            onChange={userFilterValueChange}
            style={{ width: 250 }}
          />

          <ButtonGroup>
            <Button
              type="button"
              icon="calendar"
              onClick={(e) => onMonthRangeTap(3)}
            >
              3 Months
            </Button>
            <Button
              type="button"
              icon="calendar"
              onClick={(e) => onMonthRangeTap(6)}
            >
              6 Months
            </Button>
            <Button
              type="button"
              icon="calendar"
              onClick={(e) => onMonthRangeTap(12)}
            >
              1 Year
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="card">
        <Typography.h3 className="card-header">Active Issues</Typography.h3>
        <div className="card-block pt-2">
          <ActiveIssuesComponent statusCounts={statusCounts} />
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <Typography.h3>All issues</Typography.h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              {filteredIssues && <DashboardChart issuesAll={filteredIssues} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
