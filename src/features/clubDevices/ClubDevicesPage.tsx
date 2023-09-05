import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { AuthStatus } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { CellClickedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef } from "react";

import { ClubDevice } from "../../../appsync";
import { useAppSelector } from "../../app/hooks";
import { gqlMutation } from "../../gql";
import { logFn } from "../../lib/logging";
import { useClubId } from "../../lib/useClubId";
import { mutationDeleteClubDevice } from "../../scorebridge-ts-submodule/graphql/mutations";
import { selectClubDevices } from "./clubDevicesSlice";
import { ClubName } from "./ClubName";
import { CreateClubDeviceForm } from "./CreateClubDeviceForm";
const log = logFn("src.features.clubDevices.clubDevicesPage.");

const columnDefsWithRows = [
  { field: "name", sortable: true, filter: true, flex: 5 },
  { field: "table", sortable: true, filter: true, flex: 2 },
  { field: "delete", flex: 1 },
];
const columnDefsSansRows = [{ field: "message" }];

const useVoidableColumnDefs = () => {
  const clubDevices = useAppSelector(selectClubDevices);
  if (Object.keys(clubDevices).length) {
    return columnDefsWithRows;
  } else {
    return columnDefsSansRows;
  }
};

// TODO: differentiate between loading and 0-devices
const useVoidableClubDevices = () => {
  const clubDevices = useAppSelector(selectClubDevices);
  if (!Object.keys(clubDevices).length) {
    return [{ message: "You have no club devices yet." }];
  } else {
    log("useVoidableClubDevices.1", "info", { clubDevices });
    return Object.values(clubDevices).map((v) => ({
      delete: "X",
      ...v,
    }));
  }
};

export default function ClubDevicesPage() {
  const gridRef = useRef();
  const { authStatus } = useAuthenticator();
  const voidableClubDevices = useVoidableClubDevices();
  const voidableColumnDefs = useVoidableColumnDefs();
  const clubId = useClubId();

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);
  const deleteClubDevice = async (
    clubId: string,
    clubDeviceId: string,
    authStatus: AuthStatus,
  ) => {
    return gqlMutation<ClubDevice>(authStatus, mutationDeleteClubDevice, {
      input: { clubId, clubDeviceId },
    });
  };
  const agGridRowId = ({ data }: { data: Record<string, string> }) => {
    // sufficient (globally unique) alone, tho only 1/2 of the PK in cloud for multitenancy
    return data.clubDeviceId;
  };
  const onCellClicked = useCallback(
    (event: CellClickedEvent<ClubDevice>) => {
      if (event.column.getColId() === "delete") {
        if (!event.data) {
          throw new Error("event.data should not be null here");
        }
        log("onCellClicked.deleteClubDevice.begin", "info", { event });
        if (!clubId) {
          return;
        }
        deleteClubDevice(clubId, event.data.clubDeviceId, authStatus).catch(
          (e) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            log("onCellClicked.deleteClubDevice.end.error", "error", { e });
          },
        );
      }
      log("onCellClicked", "info", event);
    },
    [authStatus, clubId],
  );

  return (
    <>
      <ClubName />
      <p>Your club devices:</p>
      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: 650 }}
        data-test-id="clubDevicesPageTable"
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <AgGridReact
          ref={gridRef}
          getRowId={agGridRowId}
          rowData={voidableClubDevices}
          columnDefs={voidableColumnDefs}
          defaultColDef={defaultColDef}
          onCellClicked={onCellClicked}
          // onFirstDataRendered={onFirstDataRendered}
        />
      </div>
      <CreateClubDeviceForm />
    </>
  );
}
