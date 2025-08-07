export interface ExpenseItem {
  name: string;
  amount: number;
  importantStatus: 'High';
}

export type AddExpensesPayload = ExpenseItem[];

export interface IncomeItem {
  name: string;
  amount: number;
}

export type AddIncomesPayload = IncomeItem[];

export interface BalancePayload {
  balance: number;
}
