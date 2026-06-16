import { VALIDATION_PATTERNS, TOKEN_LIMITS } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateStellarAddress(address: string): ValidationResult {
  if (!address.trim()) {
    return { isValid: false, error: 'Address is required' };
  }
  
  if (!VALIDATION_PATTERNS.STELLAR_ADDRESS.test(address)) {
    return { isValid: false, error: 'Invalid Stellar address format' };
  }
  
  return { isValid: true };
}

export function validateContractAddress(address: string): ValidationResult {
  if (!address.trim()) {
    return { isValid: false, error: 'Contract address is required' };
  }
  
  if (!VALIDATION_PATTERNS.CONTRACT_ADDRESS.test(address)) {
    return { isValid: false, error: 'Invalid contract address format' };
  }
  
  return { isValid: true };
}

export function validateTokenSymbol(symbol: string): ValidationResult {
  if (!symbol.trim()) {
    return { isValid: false, error: 'Token symbol is required' };
  }
  
  if (symbol.length > TOKEN_LIMITS.MAX_SYMBOL_LENGTH) {
    return { isValid: false, error: `Symbol must be ${TOKEN_LIMITS.MAX_SYMBOL_LENGTH} characters or less` };
  }
  
  if (!/^[A-Z0-9]+$/.test(symbol)) {
    return { isValid: false, error: 'Symbol must contain only uppercase letters and numbers' };
  }
  
  return { isValid: true };
}

export function validateAmount(amount: string): ValidationResult {
  if (!amount.trim()) {
    return { isValid: false, error: 'Amount is required' };
  }
  
  if (!VALIDATION_PATTERNS.AMOUNT.test(amount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }
  
  const numAmount = Number(amount);
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  return { isValid: true };
}

export function validateTokenDecimals(decimals: number): ValidationResult {
  if (decimals < TOKEN_LIMITS.MIN_DECIMALS || decimals > TOKEN_LIMITS.MAX_DECIMALS) {
    return { 
      isValid: false, 
      error: `Decimals must be between ${TOKEN_LIMITS.MIN_DECIMALS} and ${TOKEN_LIMITS.MAX_DECIMALS}` 
    };
  }
  
  return { isValid: true };
}

export function validateDateRange(startDate: Date, endDate: Date): ValidationResult {
  if (startDate >= endDate) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  if (startDate < new Date()) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }
  
  return { isValid: true };
}