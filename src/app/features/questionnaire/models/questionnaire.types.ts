export interface FamilyInfo {
  martialStatus: string;
  dependentPeople: number;
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
  { id: 'rent', name: 'Аренда жилья', icon: 'house.svg' },
  { id: 'utilities', name: 'Коммунальные услуги', icon: 'home-hashtag.svg' },
  { id: 'government', name: 'Государственные услуги', icon: 'receipt-item.svg' },
  { id: 'food', name: 'Продукты питания', icon: 'bag.svg' },
  { id: 'education', name: 'Образование', icon: 'book.svg' },
  { id: 'internet-and-communication', name: 'Интернет и связь', icon: 'wifi.svg' },
  { id: 'loans', name: 'Кредиты', icon: 'percentage-square.svg' },
  { id: 'insurance', name: 'Страхование', icon: 'shield-tick.svg' },
  { id: 'medical', name: 'Медицинские расходы', icon: 'heart-tick.svg' },
  { id: 'charity', name: 'Благотворительность', icon: 'lovely.svg' },
  { id: 'childcare', name: 'Детский сад, школа', icon: 'teacher.svg' },
  { id: 'taxes', name: 'Налоги', icon: 'receipt-edit.svg' },
  { id: 'work-related', name: 'Расходы на работу', icon: 'briefcase.svg' },
  { id: 'transport', name: 'Транспорт', icon: 'car.svg' },
  { id: 'alimony', name: 'Алименты', icon: 'wallet-add.svg' },
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
