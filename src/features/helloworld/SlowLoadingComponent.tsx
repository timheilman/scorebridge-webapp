import { useEffect, useState } from "react";

export default function SlowLoadingComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<number[]>([]);
  function loadData() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setData([1, 2, 3, 4, 5]);
    }, 1000);
  }

  useEffect(loadData, []);

  return (
    <>
      <p>Slow-Loading Component:</p>
      {loading && <p>Loading (will succeed 10 sec after initial render...)</p>}
      {data && <pre>{JSON.stringify(data, null, 1)}</pre>}
    </>
  );
}
