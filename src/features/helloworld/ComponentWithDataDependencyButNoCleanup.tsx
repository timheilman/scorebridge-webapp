import { useEffect, useState } from "react";
export default function ComponentWithDataDependencyButNoCleanup() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<number[] | null>(null);
  const [page, setPage] = useState(1);
  function loadData() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (page === 1) {
        setData([1, 2, 3, 4, 5]);
      } else if (page === 2) {
        setData([6, 7, 8, 9, 10]);
      } else {
        setData(null);
      }
    }, 1000); // I'm not clear on why this is in a setTimeout; couldn't we just do it directly?
  }

  useEffect(loadData, [page]); // here is where data dependency is explicitly passed

  function handleNext() {
    setPage((currentPage) => currentPage + 1);
  }

  return (
    <>
      <p>
        This component has a data dependency on useState data named
        &quot;page&quot;, but has no cleanup
      </p>
      {loading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 1)}</pre>}
      <span>Current Page: {page}</span>
      <button onClick={handleNext}>Next</button>
    </>
  );
}
