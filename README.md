# Browser DLP Engine (WASM + Rust) 🛡️

> Engine client-side de **Data Loss Prevention (DLP)** em tempo real para navegadores Web, compilada em **Rust / WebAssembly** e operando sob uma arquitetura _Zero-Knowledge_.

![Rust](https://img.shields.io/badge/Rust-1.70+-000000?style=for-the-badge&logo=rust)
![WebAssembly](https://img.shields.io/badge/WebAssembly-WASM-654FF0?style=for-the-badge&logo=webassembly)
![Chrome Extension Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-blue?style=for-the-badge&logo=googlechrome)

---

## 📌 Visão Geral

O **Browser DLP Engine** intercepta ações do usuário no navegador (como colar dados em campos de texto) e requisições HTTP (`fetch` e `XHR`) em tempo real para impedir o vazamento involuntário de dados sensíveis (PII, credenciais e chaves de API).

A análise é realizada em uma _thread_ separada (**Web Worker**) utilizando um binário compilado em **Rust**, garantindo tempo de execução ultrarrápido sem impactar a performance da interface do usuário.

---

## ⚙️ Algoritmos de Inspeção

- 🧮 **Entropia de Shannon:** Identifica segredos, tokens e chaves privadas calculando a aleatoriedade dos caracteres da string.
- 💳 **Validação de PII (Algoritmo de Luhn):** Detecta e valida números reais de cartão de crédito combinando expressões regulares e o algoritmo de verificação matemática de Luhn.
- 🔑 **Padrões de Credenciais:** Detecta identificadores de chaves de infraestrutura (ex: AWS Access Key IDs).

---

## 🛠️ Arquitetura do Sistema

```text
[ Página Web (UI Thread) ] ──(Input/Paste/Fetch)──► [ Web Worker ]
                                                          │
                                                    (ArrayBuffer)
                                                          │
                                                    ▼
                                           [ Core Engine (WASM) ]
                                           ├── Entropy Analyzer (Shannon)
                                           ├── Luhn Algorithm Validator
                                           └── Masking Engine
```

## Como compilar e rodar

Pré-requisitos:
**Rust & Cargo** e **wasm-pack**

## Compilar o código Rust para WASM

Na raiz do projeto, execute o comando abaixo para gerar o módulo WebAssembly dentro da pasta da extensão:

```
wasm-pack build --target web --out-dir extension/pkg
```

## Carregar a extensão no navegador

Abra o Google Chrome e navegue até chrome://extensions/;

Ative o "Modo do desenvolvedor" no canto superior direito;

Clique em "Carregar sem compactação" (Load unpacked);

Selecione a pasta extension/ do repositório.

## Testar a extensão

Abra o arquivo extension/test.html no navegador ou inspecione o console de desenvolvedor (F12) em qualquer site ao colar chaves de teste ou disparar requisições.
