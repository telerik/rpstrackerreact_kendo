import { useState } from "react";
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { EMPTY_STRING } from "../../../../core/helpers";

export type TaskFormProps = {
    addTask: (text: string) => void;
};

export function NewTaskForm(props: TaskFormProps) {

    const [newTaskTitle, setNewTaskTitle] = useState<string>(EMPTY_STRING);

    function onNewTaskTitleChanged(e: any) {
        setNewTaskTitle(e.target.value);
    }

    function onAddTapped() {
        const newTitle = newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }
        props.addTask(newTitle);
        setNewTaskTitle(EMPTY_STRING);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onAddTapped();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row align-items-center">
                <div className="col-sm-6">
                    <Input value={newTaskTitle} onChange={onNewTaskTitleChanged} placeholder="Enter new task..." name="newTask"/>
                </div>
                <Button type="button" onClick={() => onAddTapped()} themeColor="primary" disabled={!newTaskTitle}>Add</Button>
            </div>
        </form>
    );
}