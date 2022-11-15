import { useState } from "react";
import { Typography } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import { FormElement } from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { PopupPropsContext } from '@progress/kendo-react-popup';
import { Modal, ModalBody, ModalFooter } from "reactstrap";
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

    return (
        <Modal isOpen={modalShowing}>
            <div className="modal-header">
                <Typography.h4 className="modal-title" id="modal-basic-title">Add New Item</Typography.h4>
                <Button fillMode={"flat"} type="button" onClick={()=>setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </Button>
            </div>
            <ModalBody>
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
                            <PopupPropsContext.Provider value={(p) => ({...p, style: { ...(p.style || {}), zIndex: 1130 }})} >
                                <DropDownList defaultValue={newItem.typeStr} data={itemTypesProvider} name="typeStr" onChange={(e) => onFieldChange(e, 'typeStr')}/>
                            </PopupPropsContext.Provider>
                        </div>
                    </div>
                </FormElement>
            </ModalBody >
            <ModalFooter>
                <Button themeColor="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button themeColor="primary" onClick={onAddSave}>Save</Button>{' '}
            </ModalFooter>
        </Modal >
    );
}