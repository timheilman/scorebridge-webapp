import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  [
    /Hello World Hands-On-React Examples/,
    /Redux repo example counter-ts/,
  ].forEach((navButtonTitle) => {
    const linkElement = screen.getByText(navButtonTitle);
    expect(linkElement).toBeInTheDocument();
  });
});
