/// valida números de cartão de crédito utilizando o algoritmo de luhn.
pub fn validate_luhn(number_str: &str) -> bool {
    let digits: Vec<u32> = number_str
        .chars()
        .filter(|c| c.is_ascii_digit())
        .filter_map(|c| c.to_digit(10))
        .collect();

    if digits.len() < 13 || digits.len() > 19 {
        return false;
    }

    let mut sum = 0;
    let mut double = false;

    for &digit in digits.iter().rev() {
        if double {
            let d = digit * 2;
            sum += if d > 9 { d - 9 } else { d };
        } else {
            sum += digit;
        }
        double = !double;
    }

    sum % 10 == 0
}