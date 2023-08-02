import { useState } from "react";

export default function ExampleControlledComponent() {
  const [value, setValue] = useState("");
  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value.toUpperCase());
  };
  return (
    <>
      <p>Example Controlled Component</p>
      <form>
        <input type="text" value={value} onChange={handleChange} />
        <pre>{value}</pre>
      </form>
    </>
  );
}
