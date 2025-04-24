/* eslint-disable no-undef */
chrome.webRequest.onCompleted.addListener(
  function (details) {
    // Access the response details using details.responseBody, details.statusCode, etc.
    console.log("Response captured:", details);
  },
  { urls: ["<all_urls>"] }, // Intercept all URLs
  ["responseHeaders"]
);
