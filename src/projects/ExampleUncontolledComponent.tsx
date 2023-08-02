import { FormEvent, useRef } from "react";

export default function ExampleUncontolledComponent() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(inputRef.current);
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      console.log(inputValue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button>Submit</button>
    </form>
  );
}
