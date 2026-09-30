import init, { analyze_and_mask } from "../pkg/dlp_engine_wasm.js";

let isWasmLoaded = false;

init()
  .then(() => {
    isWasmLoaded = true;
  })
  .catch((err) => {
    console.error("[DLP Worker] Erro ao carregar binário WASM:", err);
  });

self.onmessage = async (event) => {
  const { id, payload } = event.data;

  if (!isWasmLoaded) {
    self.postMessage({
      id,
      result: { is_sensitive: false, reason: "WASM_NOT_READY" },
    });
    return;
  }

  try {
    const result = analyze_and_mask(payload);
    self.postMessage({ id, result });
  } catch (error) {
    console.error("[DLP Worker] Erro durante a execução WASM:", error);
    self.postMessage({
      id,
      result: { is_sensitive: false, reason: "PROCESSING_ERROR" },
    });
  }
};
