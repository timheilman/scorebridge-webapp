import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import {
  selectSuperChickenMode,
  setSuperChickenMode,
} from "../superChickenMode/superChickenModeSlice";
import { selectClubDevices } from "./clubDevicesSlice";
import { CreateClubDeviceForm } from "./CreateClubDeviceForm";
const log = logFn("src.features.clubDevices.clubDevicesPage.");

const columnDefsWithRows = [
  { field: "name", sortable: true, filter: true, flex: 1 },
  { field: "clubId" },
  { field: "clubDeviceId" },
  { field: "email" },
  { field: "createdAt" },
];
const columnDefsSansRows = [{ field: "message" }];

const useVoidableColumnDefs = () => {
  const clubDevices = useAppSelector(selectClubDevices);
  if (clubDevices.length) {
    return columnDefsWithRows;
  } else {
    return columnDefsSansRows;
  }
};

const useVoidableClubDevices = () => {
  const clubDevices = useAppSelector(selectClubDevices);
  if (!clubDevices.length) {
    return [{ message: "You have no club devices yet." }];
  } else {
    log("useVoidableClubDevices.1", "info", { clubDevices });
    return clubDevices;
  }
};

export default function ClubDevicesPage() {
  const gridRef = useRef();
  const voidableClubDevices = useVoidableClubDevices();
  const voidableColumnDefs = useVoidableColumnDefs();
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);
  const agGridRowId = ({ data }: { data: Record<string, string> }) => {
    // sufficient (globally unique) alone, tho only 1/2 of the PK in cloud for multitenancy
    return data.clubDeviceId;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFirstDataRendered = useCallback((_params: unknown) => {
    if (gridRef.current) {
      /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment */
      // @ts-ignore
      gridRef.current.api.sizeColumnsToFit();
      /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment */
    }
  }, []);

  return (
    <div>
      <p>Your club devices:</p>
      <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <AgGridReact
          ref={gridRef}
          getRowId={agGridRowId}
          rowData={voidableClubDevices}
          columnDefs={voidableColumnDefs}
          defaultColDef={defaultColDef}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
      <CreateClubDeviceForm />
    </div>
  );
}
