import { render, screen } from "@testing-library/react";

import CounterApp from "./CounterApp";

test("renders learn react link", () => {
  render(<CounterApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
