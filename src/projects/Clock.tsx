import { useState } from "react";
function addMinutes(date: Date, minutes: number) {
  //we multiply minutes by 60000 is to convert minutes to milliseconds
  return new Date(date.getTime() + minutes * 60000);
}

// function Clock() {
//   const [time, setTime] = useState(new Date());
//
//   const handleClick = () => {
//     setTime(addMinutes(time, 10));
//   };
//
//   return (
//     <div>
//       <p>{time.toLocaleTimeString()}</p>
//       <button onClick={handleClick}>+ 10 Minutes</button>
//     </div>
//   );
// }

function Clock() {
  const [time, setTime] = useState(new Date());

  const handleClick1 = () => {
    setTime(addMinutes(time, 10));
    setTime(addMinutes(time, 10));
  };

  const handleClick2 = () => {
    setTime((previousTime) => addMinutes(previousTime, 10));
    setTime((previousTime) => addMinutes(previousTime, 10));
  };

  return (
    <div>
      <p>{time.toLocaleTimeString()}</p>
      <button onClick={handleClick1}>+ 20 Minutes fails</button>
      <button onClick={handleClick2}>+ 20 Minutes succeeds</button>
    </div>
  );
}
export default Clock;
