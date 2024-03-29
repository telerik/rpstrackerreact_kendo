import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from '@progress/kendo-react-common';

import './backlog-page.css';

import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";
import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddItemModal } from "../../components/add-item-modal/add-item-modal";
import { BacklogList } from "../../components/backlog-list/backlog-list";
import { PtBacklogServiceContext, PtStoreContext } from "../../../../App";
import { BacklogGrid } from "../../components/backlog-grid/backlog-grid";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";


export function BacklogPage() {
    const store = useContext(PtStoreContext);
    const backlogService = useContext(PtBacklogServiceContext);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const { preset } = useParams() as {preset: PresetType};
    const [currentPreset, setCurrentPreset] = useState<PresetType>(preset ? preset : 'open');

    const useItems = (...params: Parameters<typeof backlogService.getItems>) => {
        return useQuery<PtItem[], Error>(getQueryKey(), () => backlogService.getItems(...params));
    }
    const queryResult = useItems(currentPreset);
    const items = queryResult.data;

    function getQueryKey() {
        return ['items', currentPreset];
    }

    const addItemMutation = useMutation(async (newItem: PtNewItem) => {
        if (store.value.currentUser) {
            const createdItem = await backlogService.addNewPtItem(newItem, store.value.currentUser);
            return createdItem;
        }
    });
    
    useEffect(()=>{
        navigate(`/backlog/${[currentPreset]}`);
    },[currentPreset]);
    
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    function onSelectPresetTap(preset: PresetType) {
        setCurrentPreset(preset);
    }

    function toggleModal() {
        setIsAddModalShowing(!isAddModalShowing);
    }

    function onNewItemSave(newItem: PtNewItem) {
        return addItemMutation.mutateAsync(newItem, {
            onSuccess(createdItem, variables, context) {
                queryClient.invalidateQueries(getQueryKey());
            },
        });
    }


    if (queryResult.isLoading) {
        return (
            <div>
                Loading...
            </div>
        );
    }
    
    if (!items) {
        return (
            <div>No items</div>
        );
    }


    return (
        <React.Fragment>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <Typography.h2>Backlog</Typography.h2>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <AppPresetFilter selectedPreset={currentPreset} onSelectPresetTap={onSelectPresetTap} />

                    <ButtonGroup className="mr-2">
                        <Button type="button" size="small" fillMode="outline" themeColor="secondary" onClick={toggleModal}>Add</Button>
                    </ButtonGroup>
                </div>
            </div>

            <BacklogGrid items={items} />

            {
            //<BacklogList items={items} />
            }

            <AddItemModal 
                onNewItemSave={onNewItemSave} 
                modalShowing={isAddModalShowing}
                setIsAddModalShowing={setIsAddModalShowing}
                />
                
        </React.Fragment >
    );
}
