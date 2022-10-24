import React, { useEffect, useState } from "react";

import { Observable } from "rxjs";

import { Input,  Slider, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList, ListItemProps } from '@progress/kendo-react-dropdowns';

import { PtItem, PtUser } from "../../../../core/models/domain";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "../../../../shared/models/forms/pt-item-details-edit-form";
import { ItemType, PT_ITEM_STATUSES, PT_ITEM_PRIORITIES } from "../../../../core/constants";

import { AssigneeListModal } from "../assignee-list-modal/assignee-list-modal";
import { getIndicatorClass } from "../../../../shared/helpers/priority-styling";

interface PtItemDetailsComponentProps {
    item: PtItem;
    itemSaved: (item: PtItem) => void;
    usersRequested: () => void;
    users$: Observable<PtUser[]>;
}

export function PtItemDetailsComponent(props: PtItemDetailsComponentProps) {

    const statusesProvider = PT_ITEM_STATUSES;
    const prioritiesProvider = PT_ITEM_PRIORITIES;
    const itemTypesProvider = ItemType.List.map((t) => t.PtItemType);

    const [itemForm, setItemForm] = useState(ptItemToFormModel(props.item));
    const [users, setUsers] = useState<PtUser[]>([]);
    const [modalIsShowing, setModalIsShowing] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState<PtUser>(props.item.assignee);
    useEffect(()=>{
        notifyUpdateItem();
    }, [selectedAssignee]);

    
    function onFieldChange(e: any, formFieldName: string) {
        if (!itemForm) {
            return;
        }
        (itemForm as any)[formFieldName] = e.target.value;
    }

    function onNonTextFieldChange(e: any, formFieldName: string) {
        onFieldChange(e, formFieldName);
        notifyUpdateItem();
    }

    function onBlurTextField() {
        notifyUpdateItem();
    }

    function notifyUpdateItem() {
        if (!itemForm) {
            return;
        }
        const updatedItem = getUpdatedItem(props.item, itemForm, selectedAssignee!);
        props.itemSaved(updatedItem);
    }

    function getUpdatedItem(item: PtItem, itemForm: PtItemDetailsEditFormModel, assignee: PtUser): PtItem {
        const updatedItem = Object.assign({}, item, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            assignee: assignee
        });
        return updatedItem;
    }

    function assigneePickerOpen() {
        props.users$.subscribe((users: PtUser[]) => {
            if (users.length > 0) {
                setUsers(users);
                setModalIsShowing(true);
            }
        });

        props.usersRequested();
    }

    function selectAssignee(u: PtUser) {
        setSelectedAssignee(u);
        setItemForm({ ...itemForm, assigneeName: u.fullName });
        setModalIsShowing(false);
        notifyUpdateItem();
    }

    function itemTypeRender(li: any, itemProps: any) {
        const dataItem = itemProps.dataItem;
        const itemTypeRow = (
            <React.Fragment>
                <img src={ItemType.imageResFromType(dataItem)} className="backlog-icon" />
                <span>{dataItem}</span>
            </React.Fragment>
        );
        return React.cloneElement(li, li.props, itemTypeRow);
    }

    function priorityRender(li: any, itemProps: ListItemProps) {
        const dataItem = itemProps.dataItem;
        const priorityRow = (
            <span className={'badge ' + getIndicatorClass(dataItem)}>{dataItem}</span>
        );
        return React.cloneElement(li, li.props, priorityRow);
    }

    if (!itemForm) {
        return null;
    }

    return (
        <React.Fragment>
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <Input defaultValue={itemForm.title} onBlur={() => onBlurTextField()} onChange={(e) => onFieldChange(e, 'title')} name="title" style={{ width: '60%' }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <TextArea defaultValue={itemForm.description} onBlur={() => onBlurTextField()} onChange={(e) => onFieldChange(e, 'description')} name="description" style={{ width: '60%', height: 100 }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Item Type</label>
                    <div className="col-sm-10">
                        <DropDownList data={itemTypesProvider} itemRender={itemTypeRender} defaultValue={itemForm.typeStr} onChange={(e) => onNonTextFieldChange(e, 'typeStr')} name="itemType" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Status</label>
                    <div className="col-sm-10">
                        <DropDownList data={statusesProvider} defaultValue={itemForm.statusStr} onChange={(e) => onNonTextFieldChange(e, 'statusStr')} name="status" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Estimate</label>
                    <div className="col-sm-10">

                        <Slider buttons={true} step={1} defaultValue={itemForm.estimate} value={itemForm.estimate} min={1} max={20} onChange={(e) => onNonTextFieldChange(e, 'estimate')} name="estimate" style={{ width: 300 }} />

                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Priority</label>
                    <div className="col-sm-10">
                        <DropDownList data={prioritiesProvider} itemRender={(li, props) => priorityRender(li, props)} defaultValue={itemForm.priorityStr} onChange={(e) => onNonTextFieldChange(e, 'priorityStr')} name="priority" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Assignee</label>

                    <div className="col-sm-10">
                        <img src={selectedAssignee!.avatar} className="li-avatar rounded" />
                        <span>{itemForm.assigneeName}</span>

                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => assigneePickerOpen()}>Pick assignee</button>
                    </div>
                </div>
            </form>

            <AssigneeListModal 
                users={users} 
                modalIsShowing={modalIsShowing} 
                setModalIsShowing={setModalIsShowing} 
                selectAssignee={selectAssignee} />


        </React.Fragment>
    );
   
}
