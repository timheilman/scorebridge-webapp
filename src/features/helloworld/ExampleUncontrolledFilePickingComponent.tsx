import { SyntheticEvent, useRef } from "react";

export default function ExampleUncontrolledFilePickingComponent() {
  const fileInput = useRef<HTMLInputElement | null>(null);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    console.log(fileInput.current);
    const files = fileInput.current?.files;
    if (files) {
      alert(`Selected file - ${files[0].name}`);
    } else {
      alert(`no files selected`);
    }
    if (!fileInput) return;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" ref={fileInput} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
