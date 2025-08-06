export interface FamilyInfo {
  maritalStatus: string;
  dependents: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  amount?: number;
}

export interface ExpenseCategories {
  selectedCategories: string[];
  amounts: Record<string, number>;
}

export interface IncomeInfo {
  salary: number;
  otherIncome: number;
}

export interface BalanceInfo {
  currentBalance: number;
}

export interface QuestionnaireData {
  family: FamilyInfo;
  expenses: ExpenseCategories;
  income: IncomeInfo;
  balance: BalanceInfo;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'rent', name: 'Аренда жилья', icon: '🏠' },
  { id: 'utilities', name: 'Коммунальные услуги', icon: '🏘️' },
  { id: 'government', name: 'Государственные услуги', icon: '📄' },
  { id: 'food', name: 'Продукты питания', icon: '🛒' },
  { id: 'education', name: 'Образование', icon: '🎓' },
  { id: 'internet', name: 'Интернет и связь', icon: '📶' },
  { id: 'credits', name: 'Кредиты', icon: '💳' },
  { id: 'insurance', name: 'Страхование', icon: '✅' },
  { id: 'medical', name: 'Медицинские расходы', icon: '💊' },
  { id: 'charity', name: 'Благотворительность', icon: '❤️' },
  { id: 'childcare', name: 'Детский сад, школа', icon: '📚' },
  { id: 'taxes', name: 'Налоги', icon: '📋' },
  { id: 'work', name: 'Расходы на работу', icon: '💼' },
  { id: 'transport', name: 'Транспорт', icon: '🚗' },
  { id: 'alimony', name: 'Алименты', icon: '👨‍👩‍👧' },
];

export const MARITAL_STATUS_OPTIONS = [
  { label: 'Выберите статус', value: '' },
  { label: 'Холост/Не замужем', value: 'single' },
  { label: 'Женат/Замужем', value: 'married' },
  { label: 'Разведен/Разведена', value: 'divorced' },
  { label: 'Вдовец/Вдова', value: 'widowed' },
];

export const DEPENDENTS_OPTIONS = [
  { label: 'Выберите количество', value: '' },
  { label: '0 человек', value: '0' },
  { label: '1-2 человека', value: '1-2' },
  { label: '3-6 человек', value: '3-6' },
  { label: '7+ человек', value: '7+' },
];
