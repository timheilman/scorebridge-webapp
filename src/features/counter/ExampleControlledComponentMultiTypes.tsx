import { SyntheticEvent, useState } from "react";

export default function ExampleControlledComponentMultiTypes() {
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    console.log("submitting", stateToString());
  }

  function stateToString() {
    return JSON.stringify(
      {
        department,
        message,
        agreedToTerms,
      },
      null,
      " ",
    );
  }

  return (
    <>
      <p>Example Controlled Component With Multi-Types</p>
      <form onSubmit={handleSubmit}>
        <select
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="hr">Human Resources</option>
          <option value="pr">Public Relations</option>
          <option value="support">Support</option>
        </select>
        <br />
        <br />
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          cols={30}
          rows={10}
        />
        <br />
        <input
          type="checkbox"
          name="agreedToTerms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        I agree to the terms and conditions.
        <br />
        <button>Send</button>
      </form>
    </>
  );
}
