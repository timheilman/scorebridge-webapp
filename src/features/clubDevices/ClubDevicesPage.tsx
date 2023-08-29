import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

import { ClubDevice } from "../../../appsync";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSuperChickenMode,
  setSuperChickenMode,
} from "../superChickenMode/superChickenModeSlice";
import { selectClubDevices } from "./clubDevicesSlice";
// import { logFn } from "../../lib/logging";
// const log = logFn("src.features.clubDevices.clubDevicesPage.");

export default function ClubDevicesPage() {
  const dispatch = useAppDispatch();
  const scm = useAppSelector(selectSuperChickenMode);
  const clubDevices = useAppSelector(selectClubDevices);
  const handleClick = () => {
    dispatch(setSuperChickenMode(!scm));
  };
  const [columnDefs] = useState<ColDef<ClubDevice, unknown>[]>([
    { field: "clubId" },
    { field: "clubDeviceId" },
    { field: "name" },
    { field: "createdAt" },
    { field: "updatedAt" },
  ]);
  return (
    <div>
      <p>This is the club devices page placeholder</p>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={clubDevices} columnDefs={columnDefs} />
      </div>
      <p>club devices remain associated to a table throughout the game</p>
      <p>eventually this will be replaced with an easter egg:</p>
      <button onClick={handleClick} data-test-id="superChickenModeButton">
        toggle SuperChickenMode
      </button>
      <p>
        player devices remain associated to their player throughout the game
      </p>
    </div>
  );
}
