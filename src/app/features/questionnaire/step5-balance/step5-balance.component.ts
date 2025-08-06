import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { BalanceInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

@Component({
  selector: 'app-step5-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step5-balance.component.html'
})
export class Step5BalanceComponent {
  balanceData = signal<BalanceInfo>({
    currentBalance: 0
  });

  isSubmitting = signal(false);
  completed = output<BalanceInfo>();

  updateBalance(value: number | null): void {
    this.balanceData.update(data => ({
      ...data,
      currentBalance: value || 0
    }));
  }

  isValid(): boolean {
    return this.balanceData().currentBalance >= 0;
  }

  async handleNext(): Promise<void> {
    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Longer for final submission
    this.isSubmitting.set(false);

    this.completed.emit(this.balanceData());
  }
}
