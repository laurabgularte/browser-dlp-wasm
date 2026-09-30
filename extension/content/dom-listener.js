(function () {
  const workerUrl = chrome.runtime.getURL("worker/dlp-worker.js");
  const worker = new Worker(workerUrl, { type: "module" });

  const pendingRequests = new Map();
  let requestId = 0;

  worker.onmessage = (event) => {
    const { id, result } = event.data;
    if (pendingRequests.has(id)) {
      const resolve = pendingRequests.get(id);
      resolve(result);
      pendingRequests.delete(id);
    }
  };

  function sendToWasm(payload) {
    return new Promise((resolve) => {
      const currentId = ++requestId;
      pendingRequests.set(currentId, resolve);
      worker.postMessage({ id: currentId, payload });
    });
  }

  // intercepta cola de dados sensíveis na UI
  document.addEventListener(
    "paste",
    async (event) => {
      const clipboardText = (
        event.clipboardData || window.clipboardData
      ).getData("text");
      if (!clipboardText) return;

      const result = await sendToWasm(clipboardText);
      if (result && result.is_sensitive) {
        event.preventDefault();
        event.stopPropagation();
        alert(
          `[DLP SECURITY] Ação bloqueada! Conteúdo sensível detectado (${result.reason}).`,
        );
      }
    },
    true,
  );

  // pega requisições de rede enviadas via injector.js
  window.addEventListener("DLP_INSPECT_PAYLOAD", async (event) => {
    const { payload } = event.detail;
    const result = await sendToWasm(payload);
    if (result && result.is_sensitive) {
      console.warn(
        `[DLP ALERT] Payload sensível detectado (${result.reason}):`,
        result.masked_content,
      );
    }
  });
})();
