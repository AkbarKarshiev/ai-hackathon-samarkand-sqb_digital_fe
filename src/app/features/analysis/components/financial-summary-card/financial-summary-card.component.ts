import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

interface FinancialSummaryData {
  balance: number;
  salary: number;
  daysUntilSalary: number;
}

@Component({
  selector: 'app-financial-summary-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './financial-summary-card.component.html',
  styleUrls: ['./financial-summary-card.component.scss']
})
export class FinancialSummaryCardComponent {
  public data = input.required<FinancialSummaryData>();

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU').format(amount);
  }
}
