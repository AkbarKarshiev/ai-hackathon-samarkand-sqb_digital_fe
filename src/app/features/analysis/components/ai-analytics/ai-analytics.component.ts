import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

interface AiAnalyticsData {
  liquidityStatus: string;
  dailyBudget?: number;
  availableForInvestment?: number;
  totalExpenses?: number;
}

@Component({
  selector: 'app-ai-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-analytics.component.html',
  styleUrls: ['./ai-analytics.component.scss']
})
export class AiAnalyticsComponent {
  public data = input.required<AiAnalyticsData>();

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU').format(amount);
  }

  public getStatusConfig(status: string): {
    title: string;
    emoji: string;
    badgeText: string;
    bgColor: string;
    textColor: string;
    badgeBgColor: string;
  } {
    switch (status) {
      case 'good':
        return {
          title: 'AI аналитика',
          emoji: '😊',
          badgeText: 'Good',
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          badgeBgColor: 'bg-green-100'
        };
      case 'critical':
        return {
          title: 'AI анализ предупреждает!',
          emoji: '😔',
          badgeText: 'Critical',
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          badgeBgColor: 'bg-red-100'
        };
      case 'moderate':
        return {
          title: 'AI аналитика',
          emoji: '😐',
          badgeText: 'Moderate',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-900',
          badgeBgColor: 'bg-orange-100'
        };
      default:
        return {
          title: 'AI аналитика',
          emoji: '😊',
          badgeText: 'Good',
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          badgeBgColor: 'bg-green-100'
        };
    }
  }
}
