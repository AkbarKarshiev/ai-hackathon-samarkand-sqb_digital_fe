import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { catchError, finalize, of } from 'rxjs';

import { LocalStorageService } from '../../core/storage/services';
import {
  AiAnalyticsComponent,
  AnalysisTabsComponent,
  ExpenseAnalysisComponent,
  FinancialSummaryCardComponent} from './components';
import { AiAdviceResponse, CalculationResponse, MainInfoResponse, Recommendation } from './models/analysis.types';
import { AnalysisApiResponse, AnalysisService } from './services/analysis.service';

interface FinancialData {
  balance: number;
  salary: number;
  daysUntilSalary: number;
  maritalStatus: string;
  dependentPeople: number;
  expenses: {
    name: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
  availableForInvestment: number;
  totalExpenses: number;
  dailyBudget?: number;
  ratio?: number;
  ratioAlert?: string;
  liquidityStatus?: string;
  recommendations?: Recommendation[];
  financialHealthAssessment?: {
    overall_score: string;
    liquidity_status: string;
    debt_burden: string;
    cash_flow: string;
  };
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FinancialSummaryCardComponent,
    ExpenseAnalysisComponent,
    AiAnalyticsComponent,
    AnalysisTabsComponent
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly analysisService = inject(AnalysisService);

  public showChatModal = signal(false);
  public isLoading = signal(true);
  public financialData = signal<FinancialData>({
    balance: 0,
    salary: 0,
    daysUntilSalary: 0,
    maritalStatus: '',
    dependentPeople: 0,
    expenses: [],
    availableForInvestment: 0,
    totalExpenses: 0,
    dailyBudget: 0,
    ratio: 0,
    ratioAlert: '',
    liquidityStatus: '',
    recommendations: [],
    financialHealthAssessment: undefined
  });

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  private loadAnalysisData(): void {
    this.isLoading.set(true);

    // Get user ID from localStorage
    const userId = this.localStorageService.getItem<number>('userId');

    if (!userId) {
      console.error('No user ID found in localStorage');
      this.isLoading.set(false);
      this.loadMockData();
      return;
    }

    // Make all API calls and wait for all to complete
    this.analysisService.getAllAnalysisData(userId.toString())
      .pipe(
        catchError((error) => {
          console.error('Error fetching analysis data:', error);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((response: AnalysisApiResponse | null) => {
        if (response) {
          this.processApiData(response.mainInfo, response.calculation, response.aiAdvice);
        } else {
          // Fallback to mock data if API fails
          this.loadMockData();
        }
      });
  }

  private processApiData(
    mainInfo: MainInfoResponse | null,
    calculation: CalculationResponse | null,
    aiAdvice: AiAdviceResponse | null
  ): void {
    // Use mock data as fallback for any failed API calls
    const mockData: FinancialData = {
      balance: 1200000,
      salary: 6500000,
      daysUntilSalary: 12,
      maritalStatus: 'Холост',
      dependentPeople: 2,
      expenses: [
        { name: 'Аренда квартиры', amount: 2000000, color: '#8B4513', percentage: 47.1 },
        { name: 'Ежемесячные траты', amount: 1500000, color: '#2E8B57', percentage: 35.3 },
        { name: 'Другие', amount: 750000, color: '#9CA3AF', percentage: 17.6 }
      ],
      availableForInvestment: 2250000,
      totalExpenses: 4250000,
      dailyBudget: 682258,
      ratio: 16.7,
      ratioAlert: 'Healthy',
      liquidityStatus: 'good',
      recommendations: [],
      financialHealthAssessment: {
        overall_score: '85',
        liquidity_status: 'good',
        debt_burden: 'healthy',
        cash_flow: 'strong'
      }
    };

    // Process main info if available
    if (mainInfo) {
      mockData.balance = mainInfo.currentBalance;
      mockData.salary = mainInfo.salary;
      mockData.daysUntilSalary = mainInfo.daysLeftToSalary;
      mockData.maritalStatus = this.getMaritalStatusDisplay(mainInfo.martialStatus);
      mockData.dependentPeople = mainInfo.dependentPeople;

      // Process expenses list if calculation data is also available
      if (calculation) {
        const topExpenses = mainInfo.expensesList.slice(0, 3);
        const totalExpenses = calculation.obligatoryPayments;

        // Calculate percentages for top 3 expenses
        const processedExpenses = topExpenses.map((expense, index) => {
          const percentage = (expense.amount / totalExpenses) * 100;
          const colors = ['#8B4513', '#2E8B57', '#4A90E2', '#F5A623', '#D0021B', '#7ED321'];
          return {
            name: expense.name,
            amount: expense.amount,
            color: colors[index % colors.length],
            percentage: percentage
          };
        });

        // Calculate remaining amount for "Others"
        const topExpensesTotal = topExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingAmount = totalExpenses - topExpensesTotal;

        if (remainingAmount > 0) {
          const othersPercentage = (remainingAmount / totalExpenses) * 100;
          processedExpenses.push({
            name: 'Другие',
            amount: remainingAmount,
            color: '#9CA3AF',
            percentage: othersPercentage
          });
        }

        mockData.expenses = processedExpenses;
        mockData.totalExpenses = totalExpenses;
      }
    }

    // Process calculation data if available
    if (calculation) {
      mockData.availableForInvestment = calculation.investmentAmount;
      mockData.dailyBudget = calculation.dailyBudget;
      mockData.ratio = calculation.ratio.ratio;
      mockData.ratioAlert = calculation.ratio.alert;
    }

    // Process AI advice if available
    if (aiAdvice) {
      mockData.liquidityStatus = aiAdvice.financial_health_assessment.liquidity_status;
      mockData.recommendations = aiAdvice.recommendations;
      mockData.financialHealthAssessment = aiAdvice.financial_health_assessment;
    }

    this.financialData.set(mockData);
  }

  private getMaritalStatusDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'single': 'Холост/Не замужем',
      'married': 'Женат/Замужем',
      'divorced': 'Разведен/Разведена',
      'widowed': 'Вдовец/Вдова'
    };
    return statusMap[status] || status;
  }

  private loadMockData(): void {
    // Use mock data for development/testing
    this.financialData.set({
      balance: 1200000,
      salary: 6500000,
      daysUntilSalary: 12,
      maritalStatus: 'Холост',
      dependentPeople: 2,
      expenses: [
        { name: 'Аренда квартиры', amount: 2000000, color: '#8B4513', percentage: 47.1 },
        { name: 'Ежемесячные траты', amount: 1500000, color: '#2E8B57', percentage: 35.3 },
        { name: 'Другие', amount: 750000, color: '#9CA3AF', percentage: 17.6 }
      ],
      availableForInvestment: 2250000,
      totalExpenses: 4250000,
      dailyBudget: 682258,
      ratio: 16.73,
      ratioAlert: 'Healthy',
      liquidityStatus: 'good',
      recommendations: [],
      financialHealthAssessment: {
        overall_score: '85',
        liquidity_status: 'good',
        debt_burden: 'healthy',
        cash_flow: 'strong'
      }
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
