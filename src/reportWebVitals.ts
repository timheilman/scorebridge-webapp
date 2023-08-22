import { ReportHandler } from "web-vitals";

import { logFn } from "./lib/logging";
const log = logFn("src.reportWebVitals.");

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch((reason) => {
        log("importProblems", "error", reason);
      });
  }
};

export default reportWebVitals;
