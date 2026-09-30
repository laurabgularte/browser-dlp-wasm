(function () {
  const originalFetch = window.fetch;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  // interceptação de chamadas fetch API
  window.fetch = async function (...args) {
    const [resource, config] = args;
    if (config && config.body && typeof config.body === "string") {
      window.dispatchEvent(
        new CustomEvent("DLP_INSPECT_PAYLOAD", {
          detail: { payload: config.body, type: "fetch" },
        }),
      );
    }
    return originalFetch.apply(this, args);
  };

  // interceptação de requisições XMLHttpRequest
  XMLHttpRequest.prototype.send = function (body) {
    if (body && typeof body === "string") {
      window.dispatchEvent(
        new CustomEvent("DLP_INSPECT_PAYLOAD", {
          detail: { payload: body, type: "xhr" },
        }),
      );
    }
    return originalXhrSend.apply(this, arguments);
  };
})();
