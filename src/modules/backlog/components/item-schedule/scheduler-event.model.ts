import { PtTask } from "../../../../core/models/domain";
import { PtNewTask } from "../../../../shared/models/dto/pt-new-task";

export type SchedulerEvent = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    isAllDay: boolean;
};

export function ptTaskToSchedulerEvent(ptTask: PtTask): SchedulerEvent {
    const evt: SchedulerEvent = {
        id: ptTask.id,
        title: ptTask.title ? ptTask.title : '',
        start: ptTask.dateStart ? ptTask.dateStart : new Date(),
        end: ptTask.dateEnd ? ptTask.dateEnd : new Date(),
        isAllDay: false
    };
    return evt;
}

export function validEventsFromTasks(ptTasks: PtTask[]): SchedulerEvent[] {
    return ptTasks.filter(t => t.dateStart && t.dateEnd).map(ptTaskToSchedulerEvent);
}
