import { PtTask } from "../../../../core/models/domain";
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox, Input } from "@progress/kendo-react-inputs";

export type PtTaskDisplayComponentProps = {
    task: PtTask;
    onToggleTaskCompletion: (task: PtTask) => void;
    onDeleteTask: (task: PtTask) => void;
    onTaskFocused: (task: PtTask) => void;
    onTaskBlurred: (task: PtTask) => void;
    taskTitleChange: (task: PtTask, newTitle: string) => void;
};

export function PtTaskDisplayComponent(props: PtTaskDisplayComponentProps) {

    const { task, onToggleTaskCompletion, onDeleteTask  } = props;

    function taskTitleChange(event: any) {
        if (task.title === event.target.value) {
            return;
        }
        props.taskTitleChange(task, event.target.value);
    }

    function toggleTapped() {
        onToggleTaskCompletion(task);
    }

    function deleteTapped() {
        onDeleteTask(task);
    }
    
    function onFocused() {
        props.onTaskFocused(task);
    }

    function onBlurred() {
        props.onTaskBlurred(task);
    }

    return (
        <div key={task.id} className="input-group mb-3 col-12">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <Checkbox type="checkbox" checked={task.completed} onChange={toggleTapped} aria-label="Checkbox for following text input" name={'checked' + task.id}/>
                </div>
            </div>
            <Input defaultValue={task.title} onChange={taskTitleChange} onFocus={onFocused} onBlur={onBlurred}
                type="text" className="form-control" aria-label="Text input with checkbox" name={'tasktitle' + task.id}
            />
            <div className="input-group-append">
                <Button type="button" onClick={deleteTapped} themeColor="error" style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>Delete</Button>
            </div>
        </div>
    );
}