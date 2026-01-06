// Form validation utilities

import { FormErrors, CheckoutFormData } from './types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - allows various formats with country codes
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export function validateCheckoutForm(data: CheckoutFormData): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Address validation
  if (!data.address.trim()) {
    errors.address = 'Street address is required';
  }

  // City validation
  if (!data.city.trim()) {
    errors.city = 'City is required';
  }

  // Postal code validation
  if (!data.postalCode.trim()) {
    errors.postalCode = 'Postal code is required';
  }

  // Country validation
  if (!data.country.trim()) {
    errors.country = 'Country is required';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
