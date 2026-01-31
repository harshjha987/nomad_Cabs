export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
    'pk_test_51SRoS3Rr44IaCvAFGx3O12UUuUfTm8KFe3UYEMaj13fdi3IDV4FWU0N9g0BqqyGJVxehXEeU8tSUy8bWwKg1r58O001q1J3P6J',
  currency: 'inr',
  country: 'IN',
};

// ✅ UPI-specific appearance configuration
export const STRIPE_UPI_OPTIONS = {
  mode: 'payment',
  currency: 'inr',
  paymentMethodTypes: ['upi'],  // ✅ Only UPI
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary: '#00D632',      // ✅ UPI green color
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'Poppins, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Label': {
        color: '#ffffff',
      },
      '.Input': {
        backgroundColor: '#141414',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
      },
      '.Input:focus': {
        borderColor: '#00D632',
        boxShadow: '0 0 0 2px rgba(0, 214, 50, 0.2)',
      },
    },
  },
};

console.log('✅ Stripe configured for UPI payments');