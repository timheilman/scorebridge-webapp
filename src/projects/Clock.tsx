import { useEffect, useState } from "react";
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

// Still Messy!
function Clock() {
  const [time, setTime] = useState(new Date());

  const interval = setInterval(() => setTime(new Date()), 5000);
  useEffect(() => {
    return () => {
      clearInterval(interval); // This does not seem to work! Still getting quicker-than-5s refreshes after a few clicks
    };
  });

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
      Updates to true time every 5 seconds (even with multiple renders):{" "}
      <p>{time.toLocaleTimeString()}</p>
      <button onClick={handleClick1}>
        + 20 Minutes may fail due to react event batching (tho it also may
        not...)
      </button>
      <button onClick={handleClick2}>
        + 20 Minutes always succeeds via previousTime-parameterized setting
        function
      </button>
    </div>
  );
}
export default Clock;
