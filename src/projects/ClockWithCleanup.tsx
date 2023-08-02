import { useEffect, useState } from "react";
function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

function ClockWithCleanup() {
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
        Clock with proper cleanup should update to true time any multiple of
        five seconds after the most recent initial-render or a button press.
      </p>
      <p>{time.toLocaleTimeString()}</p>
      <button onClick={handleClick1}>
        + 20 fake minutes may fail as +10 fake minutes instead due to react
        event batching (tho it also may also succeed as +20 fake minutes...)
      </button>
      <button onClick={handleClick2}>
        + 20 fake minutes always succeeds via previousTime-parameterized setting
        function, until next 5-secondly refresh to real time
      </button>
    </div>
  );
}
export default ClockWithCleanup;
