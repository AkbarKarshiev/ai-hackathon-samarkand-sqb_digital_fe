import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { IncomeInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

@Component({
  selector: 'app-step4-income',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step4-income.component.html'
})
export class Step4IncomeComponent {
  incomeData = signal<IncomeInfo>({
    salary: 0,
    otherIncome: 0
  });

  isSubmitting = signal(false);
  completed = output<IncomeInfo>();

  updateSalary(value: number | null): void {
    this.incomeData.update(data => ({
      ...data,
      salary: value || 0
    }));
  }

  updateOtherIncome(value: number | null): void {
    this.incomeData.update(data => ({
      ...data,
      otherIncome: value || 0
    }));
  }

  isValid(): boolean {
    return this.incomeData().salary > 0;
  }

  async handleNext(): Promise<void> {
    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isSubmitting.set(false);

    this.completed.emit(this.incomeData());
  }
}
