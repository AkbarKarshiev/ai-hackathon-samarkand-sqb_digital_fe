import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { LocalStorageService } from '../../core/storage/services';
import { QuestionnaireData, EXPENSE_CATEGORIES } from '../questionnaire/models/questionnaire.types';

interface FinancialData {
  balance: number;
  salary: number;
  daysUntilSalary: number;
  maritalStatus: string;
  expenses: Array<{
    name: string;
    amount: number;
    color: string;
  }>;
  availableForInvestment: number;
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  public showChatModal = signal(false);
  public financialData = signal<FinancialData>({
    balance: 0,
    salary: 0,
    daysUntilSalary: 0,
    maritalStatus: '',
    expenses: [],
    availableForInvestment: 0
  });

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  private loadAnalysisData(): void {
    // Get questionnaire data from router state or use mock data
    const navigation = this.router.getCurrentNavigation();
    const questionnaireData = navigation?.extras?.state?.['questionnaireData'] as QuestionnaireData;

    if (questionnaireData) {
      this.calculateFinancialAnalysis(questionnaireData);
    } else {
      // Use mock data for development/testing
      this.financialData.set({
        balance: 1200000,
        salary: 6500000,
        daysUntilSalary: 12,
        maritalStatus: 'Холост',
        expenses: [
          { name: 'Аренда квартиры', amount: 2000000, color: '#8B4513' },
          { name: 'Ежемесячные траты', amount: 3500000, color: '#2E8B57' }
        ],
        availableForInvestment: 4000000
      });
    }
  }

  private calculateFinancialAnalysis(data: QuestionnaireData): void {
    // Calculate total monthly expenses
    const totalExpenses = Object.values(data.expenses.amounts).reduce((sum, amount) => sum + amount, 0);

    // Get expense details with names and colors
    const expenses = Object.entries(data.expenses.amounts).map(([categoryId, amount], index) => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
      const colors = ['#8B4513', '#2E8B57', '#4A90E2', '#F5A623', '#D0021B', '#7ED321'];
      return {
        name: category?.name || categoryId,
        amount: amount,
        color: colors[index % colors.length]
      };
    });

    // Calculate available for investment
    const totalIncome = data.income.salary + data.income.otherIncome;
    const availableForInvestment = totalIncome - totalExpenses;

    // Calculate days until salary (mock calculation)
    const today = new Date();
    const daysUntilEndOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();

    // Get marital status display
    const maritalStatusMap: Record<string, string> = {
      'single': 'Холост/Не замужем',
      'married': 'Женат/Замужем',
      'divorced': 'Разведен/Разведена',
      'widowed': 'Вдовец/Вдова'
    };

    this.financialData.set({
      balance: data.balance.currentBalance,
      salary: data.income.salary,
      daysUntilSalary: Math.max(1, daysUntilEndOfMonth),
      maritalStatus: maritalStatusMap[data.family.maritalStatus] || data.family.maritalStatus,
      expenses: expenses,
      availableForInvestment: Math.max(0, availableForInvestment)
    });
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU').format(amount);
  }

  public goBack(): void {
    this.router.navigate(['/questionnaire']);
  }

  public openChat(): void {
    this.showChatModal.set(true);
  }

  public closeChat(): void {
    this.showChatModal.set(false);
  }
}
