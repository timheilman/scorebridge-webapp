import { useEffect, useState } from "react";
function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 5000);
    return () => clearInterval(interval);
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
      <p>
        Messy clock initially updates to true time every 5 seconds, but multiple
        clicks causes too-frequent updates:
      </p>
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
