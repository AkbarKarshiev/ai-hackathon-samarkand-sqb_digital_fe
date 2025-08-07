import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

import { Recommendation } from '../../models/analysis.types';

interface AnalysisTabsData {
  liquidityStatus: string;
  dailyBudget?: number;
  availableForInvestment?: number;
  totalExpenses?: number;
  salary?: number;
  recommendations?: Recommendation[];
  expenses?: {
    name: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
  financialHealthAssessment?: {
    overall_score: string;
    liquidity_status: string;
    debt_burden: string;
    cash_flow: string;
  };
}

@Component({
  selector: 'app-analysis-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-tabs.component.html',
  styleUrls: ['./analysis-tabs.component.scss']
})
export class AnalysisTabsComponent {
  public data = input.required<AnalysisTabsData>();

  public activeTab = signal<'ai-tips' | 'expense-analysis'>('ai-tips');
  public slideDirection = signal<'left' | 'right'>('right');

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU').format(amount);
  }

  public formatCurrencySafely(value: string): string {
    // Handle cases where the value contains text instead of just numbers
    if (value.includes('UZS')) {
      // Extract number from "2980000.00 UZS" format
      const numMatch = value.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        const num = parseFloat(numMatch[1]);
        if (!isNaN(num)) {
          return this.formatCurrency(num);
        }
      }
    }

    // Try direct parsing for pure numbers
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'не число';
    }
    return this.formatCurrency(num);
  }

  public getExpectedReturnText(expectedReturn: string, productType: string): string {
    // Handle emergency fund case
    if (productType === 'emergency_fund') {
      if (expectedReturn === 'Emergency coverage') {
        return 'Покрытие экстренных расходов';
      }
      return expectedReturn;
    }

    // For other products, try to format as currency
    const formatted = this.formatCurrencySafely(expectedReturn);
    if (formatted === 'не число') {
      return expectedReturn; // Return original text if not a number
    }
    return formatted + ' сум';
  }

  public getProductDisplayName(productType: string): string {
    const productNames: Record<string, string> = {
      'microloan': 'Микрозайм',
      'online_loan': 'Онлайн займ',
      'overdraft': 'Овердрафт',
      'credit_line': 'Кредитная линия',
      'consumer_loan': 'Потребительский кредит',
      'gold': 'Золото',
      'foyda_deposit': 'Депозит «Фойда»',
      'qulay_deposit': 'Депозит «Қулай»',
      'gold_investment': 'Инвестиция в золото',
      'usd_deposit': 'Депозит в долларах',
      'emergency_fund': 'Резервный фонд',
    };
    return productNames[productType] || productType;
  }

  public getProductIcon(productType: string): string {
    const productIcons: Record<string, string> = {
      'microloan': '💰',
      'online_loan': '💻',
      'overdraft': '🌍',
      'credit_line': '💳',
      'consumer_loan': '🏠',
      'gold': '🪙',
      'foyda_deposit': '🏦',
      'qulay_deposit': '🏦',
      'gold_investment': '🪙',
      'usd_deposit': '💵',
      'emergency_fund': '🛡️'
    };
    return productIcons[productType] || '💡';
  }

  public getCategoryBackgroundClass(category: string): string {
    const categoryClasses: Record<string, string> = {
      'investment': 'bg-green-500',
      'emergency': 'bg-orange-400',
      'optimization': 'bg-sky-500'
    };
    return categoryClasses[category] || 'bg-sky-500';
  }

  public getExpenseAnalysisText(): string {
    const assessment = this.data().financialHealthAssessment;
    if (!assessment) return 'Отличное управление деньгами';

    const overallScore = parseInt(assessment.overall_score);
    const liquidityStatus = assessment.liquidity_status;
    const debtBurden = assessment.debt_burden;

    if (overallScore >= 80 && liquidityStatus === 'good' && debtBurden === 'healthy') {
      return 'Отличное управление деньгами';
    } else if (overallScore >= 60 && liquidityStatus === 'moderate') {
      return 'Хорошее управление деньгами';
    } else {
      return 'Требуется улучшение управления деньгами';
    }
  }

  public getExpensePercentage(): number {
    if (!this.data().totalExpenses || !this.data().salary) return 50;
    return Math.round((this.data().totalExpenses! / this.data().salary!) * 100);
  }

  public getFutureTips(): string[] {
    const assessment = this.data().financialHealthAssessment;
    const availableForInvestment = this.data().availableForInvestment;
    const salary = this.data().salary;

    const tips: string[] = [];

    if (assessment) {
      const overallScore = parseInt(assessment.overall_score);

      if (overallScore >= 80) {
        tips.push('• Рассмотрите покупку недвижимости');
        tips.push('• Увеличьте инвестиционный портфель');
        tips.push('• Создайте резервный фонд');
      } else if (overallScore >= 60) {
        tips.push('• Создайте резервный фонд');
        tips.push('• Оптимизируйте расходы');
        tips.push('• Рассмотрите дополнительные источники дохода');
      } else {
        tips.push('• Сократите обязательные расходы');
        tips.push('• Создайте план погашения долгов');
        tips.push('• Рассмотрите консолидацию кредитов');
      }
    }

    if (availableForInvestment && availableForInvestment > 1000000) {
      tips.push('• Рассмотрите вариант открытия ИП для дополнительного дохода');
    }

    if (salary && salary > 5000000) {
      tips.push('• Увеличьте инвестиционный портфель');
    }

    return tips.length > 0 ? tips : [
      '• Рассмотрите покупку недвижимости',
      '• Увеличьте инвестиционный портфель',
      '• Создайте резервный фонд',
      '• Рассмотрите вариант открытия ИП для дополнительного дохода'
    ];
  }

  public onTabChange(value: 'ai-tips' | 'expense-analysis'): void {
    const currentTab = this.activeTab();
    const newTab = value;

    // Determine slide direction
    if (currentTab === 'ai-tips' && newTab === 'expense-analysis') {
      this.slideDirection.set('right');
    } else if (currentTab === 'expense-analysis' && newTab === 'ai-tips') {
      this.slideDirection.set('left');
    }

    this.activeTab.set(value);
  }
}
