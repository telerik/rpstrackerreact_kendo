import { ButtonGroup, Button } from "@progress/kendo-react-buttons";

import { PresetType } from "../../../core/models/domain/types";
type AppPresetFilterProps = {
  selectedPreset: PresetType;
  onSelectPresetTap: (preset: PresetType) => void;
};

export function AppPresetFilter(props: AppPresetFilterProps) {
  return (
    <ButtonGroup className="mr-2">
      <Button type="button" togglable={true} selected={props.selectedPreset === "my"} fillMode="outline" size="small" themeColor="secondary" onClick={() => props.onSelectPresetTap("my")}>My Items</Button>
      <Button type="button" togglable={true} selected={props.selectedPreset === "open"} fillMode="outline" size="small" themeColor="secondary" onClick={() => props.onSelectPresetTap("open")}>Open Items</Button>
      <Button type="button" togglable={true} selected={props.selectedPreset === "closed"} fillMode="outline" size="small" themeColor="secondary" onClick={() => props.onSelectPresetTap("closed")}>Closed Items</Button>
    </ButtonGroup>
  );
}
