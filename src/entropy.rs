use std::collections::HashMap;

/// calcula a entropia de shannon de uma string em bits por caractere.
pub fn calculate_shannon_entropy(input: &str) -> f64 {
    if input.is_empty() {
        return 0.0;
    }

    let mut char_counts = HashMap::new();
    for ch in input.chars() {
        *char_counts.entry(ch).or_insert(0) += 1;
    }

    let total_chars = input.len() as f64;
    char_counts.values().fold(0.0, |acc, &count| {
        let p = (count as f64) / total_chars;
        acc - p * p.log2()
    })
}