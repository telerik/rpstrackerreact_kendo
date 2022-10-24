import React, { useEffect, useState } from "react";
import { BacklogService } from "../../services/backlog.service";
import { BacklogRepository } from "../../repositories/backlog.repository";
import { Store } from "../../../../core/state/app-store";
import { PresetType } from "../../../../core/models/domain/types";
import { PtItem } from "../../../../core/models/domain";

import './backlog-page.css';

import { AppPresetFilter } from "../../../../shared/components/preset-filter/preset-filter";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddItemModal } from "../../components/add-item-modal/add-item-modal";
import { BacklogList } from "../../components/backlog-list/backlog-list";
import { BacklogGrid } from "../../components/backlog-grid/backlog-grid";


const store: Store = new Store();
const backlogRepo: BacklogRepository = new BacklogRepository();
const backlogService: BacklogService = new BacklogService(backlogRepo, store);

type GetPtItemsParams = Parameters<typeof backlogService.getItems>;

export function BacklogPage() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const { preset } = useParams() as {preset: PresetType};
    const [currentPreset, setCurrentPreset] = useState<PresetType>(preset ? preset : 'open');

    const useItems = (...params: GetPtItemsParams) => {
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
                <h1 className="h2">Backlog</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <AppPresetFilter selectedPreset={currentPreset} onSelectPresetTap={onSelectPresetTap} />

                    <div className="btn-group mr-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleModal}>Add</button>
                    </div>
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
