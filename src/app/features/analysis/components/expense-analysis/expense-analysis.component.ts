import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

interface ExpenseItem {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface ExpenseAnalysisData {
  maritalStatus: string;
  dependentPeople: number;
  expenses: ExpenseItem[];
  totalExpenses: number;
  availableForInvestment: number;
}

@Component({
  selector: 'app-expense-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-analysis.component.html',
  styleUrls: ['./expense-analysis.component.scss']
})
export class ExpenseAnalysisComponent {
  public data = input.required<ExpenseAnalysisData>();

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU').format(amount);
  }
}
