import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSuperChickenMode,
  setSuperChickenMode,
} from "../internalTesting/superChickenModeSlice";

export default function ClubDevicesPage() {
  const dispatch = useAppDispatch();
  const scm = useAppSelector(selectSuperChickenMode);
  const handleClick = () => {
    console.log(`Dispatching scm; it was ${scm ? "truthy" : "falsy"}`);
    dispatch(setSuperChickenMode(!scm));
  };
  return (
    <div>
      <p>This is the club devices page placeholder</p>
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
