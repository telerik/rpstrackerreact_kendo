import { useState } from "react";
import { Button } from '@progress/kendo-react-buttons';
import { FormElement } from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { ItemType } from "../../../../core/constants";
import { EMPTY_STRING } from "../../../../core/helpers";
import { PtItem } from "../../../../core/models/domain";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";

export type AddItemModalProps = {
    modalShowing: boolean;
    onNewItemSave: (newItem: PtNewItem) => Promise<PtItem | undefined>;
    setIsAddModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
};

const initModalNewItem = (): PtNewItem =>  {
    return {
        title: EMPTY_STRING,
        description: EMPTY_STRING,
        typeStr: 'PBI'
    };
}

export function AddItemModal(props: AddItemModalProps) {

    const [newItem, setNewItem] = useState(initModalNewItem());
    
    const modalShowing = props.modalShowing;
    const setShowModal = props.setIsAddModalShowing;
    const itemTypesProvider = ItemType.List.map((t) => t.PtItemType);

    function onFieldChange(e: any, formFieldName: string) {
        if (!newItem) {
            return;
        }
        setNewItem({ ...newItem, [formFieldName]: e.target.value });
    }

    async function onAddSave() {
        const createdItem = await props.onNewItemSave(newItem);
        setShowModal(false);
        setNewItem(initModalNewItem());
    }

    return modalShowing ? (
        <Dialog title="Add New Item" onClose={()=>setShowModal(false)}>
            <FormElement horizontal={true}>
                <div className="k-form-field">
                    <Label>Title</Label>
                    <div className="k-form-field-wrap">
                        <Input defaultValue={newItem.title} onChange={(e) => onFieldChange(e, 'title')} name="title" />
                    </div>
                </div>
                <div className="k-form-field">
                    <Label>Description</Label>
                    <div className="k-form-field-wrap">
                        <TextArea rows={2} defaultValue={newItem.description} onChange={(e) => onFieldChange(e, 'description')} name="description" />
                    </div>
                </div>
                <div className="k-form-field">
                    <Label>Type</Label>
                    <div className="k-form-field-wrap">
                        <DropDownList defaultValue={newItem.typeStr} data={itemTypesProvider} name="typeStr" onChange={(e) => onFieldChange(e, 'typeStr')}/>
                    </div>
                </div>
            </FormElement>
            <DialogActionsBar>
                <Button themeColor="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button themeColor="primary" onClick={onAddSave}>Save</Button>{' '}
            </DialogActionsBar>
        </Dialog >)
        : null;
}