mod entropy;
mod luhn;

use wasm_bindgen::prelude::*;
use regex::Regex;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct DlpAnalysisResult {
    pub is_sensitive: bool,
    pub reason: String,
    pub masked_content: String,
    pub entropy_score: f64,
}

#[wasm_bindgen]
pub fn analyze_and_mask(text: &str) -> JsValue {
    let entropy = entropy::calculate_shannon_entropy(text);
    let mut is_sensitive = false;
    let mut reason = String::from("CLEAN");
    let mut masked = text.to_string();

    // 1. identificação de segredos por entropia alta (ex: API keys/tokens)
    if text.len() >= 20 && entropy > 4.5 {
        is_sensitive = true;
        reason = String::from("HIGH_ENTROPY_SECRET");
        masked = format!("[REDACTED_HIGH_ENTROPY_SECRET_{:.2}]", entropy);
    }

    // 2. detecção de cartão de crédito via Regex + algoritmo de luhn
    let cc_regex = Regex::new(r"\b(?:\d[ -]*?){13,19}\b").unwrap();
    for mat in cc_regex.find_iter(text) {
        let matched_str = mat.as_str();
        if luhn::validate_luhn(matched_str) {
            is_sensitive = true;
            reason = String::from("PII_CREDIT_CARD");
            masked = cc_regex.replace_all(&masked, "[REDACTED_CREDIT_CARD]").to_string();
            break;
        }
    }

    // 3. detecção de AWS Access Key ID
    let aws_regex = Regex::new(r"(?i)AKIA[0-9A-Z]{16}").unwrap();
    if aws_regex.is_match(text) {
        is_sensitive = true;
        reason = String::from("AWS_ACCESS_KEY");
        masked = aws_regex.replace_all(&masked, "[REDACTED_AWS_KEY]").to_string();
    }

    let result = DlpAnalysisResult {
        is_sensitive,
        reason,
        masked_content: masked,
        entropy_score: entropy,
    };

    serde_wasm_bindgen::to_value(&result).unwrap()
}