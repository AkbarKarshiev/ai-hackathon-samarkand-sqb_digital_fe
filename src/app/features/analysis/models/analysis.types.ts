export interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  importantStatus: string;
  crOn: string;
}

export interface MainInfoResponse {
  currentBalance: number;
  salary: number;
  martialStatus: string;
  dependentPeople: number;
  daysLeftToSalary: number;
  totalExpenses: number;
  expensesList: ExpenseItem[];
}

export interface RatioData {
  ratio: number;
  alert: string;
}

export interface FinancialHealthAssessment {
  overall_score: string;
  liquidity_status: string;
  debt_burden: string;
  cash_flow: string;
}

export interface KeyCalculations {
  daily_budget: string;
  family_daily_minimum: string;
  monthly_surplus: string;
  debt_capacity_remaining: string;
}

export interface Recommendation {
  category: string;
  product_type: string;
  amount: string;
  expected_cost_or_return: string;
  reasoning: string;
  priority: string;
  implementation_timeline: string;
}

export interface AiAdviceResponse {
  financial_health_assessment: FinancialHealthAssessment;
  key_calculations: KeyCalculations;
  recommendations: Recommendation[];
  risk_warnings: string[];
  monitoring_metrics: string[];
}

export interface CalculationResponse {
  totalAvailableIncome: number;
  dailyMandatoryExpanse: number;
  dailyBudget: number;
  obligatoryPayments: number;
  ratio: RatioData;
  investmentAmount: number;
  isAlert: boolean;
}

export interface AnalysisData {
  currentBalance: number;
  salary: number;
  martialStatus: string;
  dependentPeople: number;
  daysLeftToSalary: number;
  totalExpenses: number;
  expensesList: ExpenseItem[];
}
