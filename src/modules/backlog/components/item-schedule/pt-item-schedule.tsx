import { useState } from "react";
import { PtTask } from "../../../../core/models/domain";

import { PtTaskAllUpdate, PtTaskTitleUpdate } from "../../../../shared/models/dto/pt-task-update";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";
import { UseMutationResult } from "react-query";
import { AgendaView, DayView, MonthView, Scheduler, SchedulerDataChangeEvent, TimelineView, WeekView } from "@progress/kendo-react-scheduler";

import { SchedulerEvent, validEventsFromTasks } from "./scheduler-event.model";

export type PtItemScheduleComponentProps = {
    tasks: PtTask[];
    addTaskMutation: UseMutationResult<PtTask, unknown, PtNewTask, unknown>;
    deleteTaskMutation: UseMutationResult<boolean, unknown, PtTask, unknown>;
    updateTaskMutation: UseMutationResult<PtTask, unknown, PtTaskTitleUpdate, unknown>;
};

export function PtItemScheduleComponent(props: PtItemScheduleComponentProps) {

    const [events, setEvents] = useState<SchedulerEvent[]>(validEventsFromTasks(props.tasks));
    const displayDate = new Date(Math.min.apply(null, events.map((e) => new Date(e.start).valueOf())));
    const startTime = '07:00';

    const addTask = (schedEvent: SchedulerEvent) => {
        const newTask: PtNewTask = {
                title: schedEvent.title,
                completed: false,
                dateStart: schedEvent.start,
                dateEnd: schedEvent.end
        };
        props.addTaskMutation.mutate(newTask, {
            onSuccess(createdTask) {
                const newTaskEntries = [createdTask, ...props.tasks];
                setEvents(validEventsFromTasks(newTaskEntries));
            },
        });
    };

    const updateTask = (schedEvent: SchedulerEvent) => {
        const index = props.tasks.findIndex(t => t.id === schedEvent.id);
        const theTask = props.tasks[index];
        const taskUpdate: PtTaskAllUpdate = {
            task: theTask,
            newTitle: schedEvent.title,
            dateStart: schedEvent.start,
            dateEnd: schedEvent.end,
        };
        
        props.updateTaskMutation.mutate(taskUpdate, {
            onSuccess(updatedTask) {
                const newTaskEntries = [...props.tasks];
                newTaskEntries[index].title = updatedTask.title;
                setEvents(validEventsFromTasks(newTaskEntries));
            },
        });
    }

    const removeTask = (schedEvent: SchedulerEvent) => {
        const index = props.tasks.findIndex(t => t.id === schedEvent.id);
        const theTask = props.tasks[index];
        props.deleteTaskMutation.mutate(theTask!, {
            onSuccess(deleted) {
                if (deleted) {
                    const newTaskEntries = [...props.tasks];
                    newTaskEntries.splice(index, 1);
                    setEvents(validEventsFromTasks(newTaskEntries));
                }
            },
        });

    };

    const handleDataChange = ({
        created,
        updated,
        deleted,
      }: SchedulerDataChangeEvent) => {
        created.forEach((schedEvent: SchedulerEvent) => {
            addTask(schedEvent);
        });

        updated.forEach((schedEvent: SchedulerEvent) => {
            updateTask(schedEvent);
        });

        deleted.forEach((schedEvent: SchedulerEvent) => {
            removeTask(schedEvent);
        });
      };

    return (
        <div>
            <Scheduler 
                data={events} 
                date={displayDate}
                editable={true}
                onDataChange={handleDataChange}
                style={{ height: 600 }}>
                <DayView startTime={startTime} />
                <WeekView startTime={startTime} />
                <MonthView />
                <TimelineView />
                <AgendaView />

            </Scheduler>
        </div>
    );
    
}
