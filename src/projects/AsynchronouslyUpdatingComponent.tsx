import { useState } from "react";
export default function AsynchronouslyUpdatingComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<number[]>([]);
  function loadData() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setData([1, 2, 3, 4]);
    }, 3000);
  }

  return (
    <>
      <p>Asynchronously-updating Component:</p>
      {loading && <p>Loading...</p>}
      <pre>{JSON.stringify(data, null, " ")}</pre>
      <button onClick={loadData}>Load Data</button>
    </>
  );
}
