export interface EmiCalculationInput {
  vehiclePrice: number;
  downPayment: number;
  interestRateAnnual: number; // e.g. 8.99 for 8.99%
  tenureMonths: number;       // e.g. 60 for 5 years
}

export interface EmiCalculationResult {
  vehiclePrice: number;
  downPayment: number;
  principalLoanAmount: number;
  interestRateAnnual: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationPreview: Array<{
    month: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

/**
 * Standard reducing-balance EMI formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Where:
 * P = Principal Loan Amount
 * r = Monthly interest rate (Annual rate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEmi(input: EmiCalculationInput): EmiCalculationResult {
  const { vehiclePrice, downPayment, interestRateAnnual, tenureMonths } = input;

  const principal = Math.max(0, vehiclePrice - downPayment);
  
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      vehiclePrice,
      downPayment,
      principalLoanAmount: 0,
      interestRateAnnual,
      tenureMonths,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
      amortizationPreview: [],
    };
  }

  const monthlyRate = interestRateAnnual / 12 / 100;
  
  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = principal / tenureMonths;
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEmi = (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
  }

  const roundedEmi = Math.round(monthlyEmi);
  const totalPayment = roundedEmi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  // Generate 6-month preview for schedule visualization
  const amortizationPreview = [];
  let balance = principal;
  const previewMonths = Math.min(6, tenureMonths);

  for (let m = 1; m <= previewMonths; m++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = roundedEmi - interestForMonth;
    balance = Math.max(0, balance - principalForMonth);

    amortizationPreview.push({
      month: m,
      principalPaid: Math.round(principalForMonth),
      interestPaid: Math.round(interestForMonth),
      remainingBalance: Math.round(balance),
    });
  }

  return {
    vehiclePrice,
    downPayment,
    principalLoanAmount: principal,
    interestRateAnnual,
    tenureMonths,
    monthlyEmi: roundedEmi,
    totalInterest,
    totalPayment,
    amortizationPreview,
  };
}
