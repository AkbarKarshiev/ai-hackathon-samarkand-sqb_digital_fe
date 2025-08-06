import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';
import { EXPENSE_CATEGORIES } from '../models/questionnaire.types';

@Component({
  selector: 'app-step3-expense-amounts',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step3-expense-amounts.component.html'
})
export class Step3ExpenseAmountsComponent {
  selectedCategoryIds = input.required<string[]>();

  amounts = signal<Record<string, number>>({});
  isSubmitting = signal(false);
  completed = output<Record<string, number>>();

  selectedCategoriesData = computed(() => {
    return EXPENSE_CATEGORIES.filter(cat =>
      this.selectedCategoryIds().includes(cat.id)
    );
  });

  updateAmount(categoryId: string, value: number | null): void {
    this.amounts.update(current => ({
      ...current,
      [categoryId]: value || 0
    }));
  }

  isValid(): boolean {
    const currentAmounts = this.amounts();
    return this.selectedCategoryIds().every(categoryId => {
      const amount = currentAmounts[categoryId];
      return amount !== undefined && amount > 0;
    });
  }

  async handleNext(): Promise<void> {
    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    this.isSubmitting.set(false);

    this.completed.emit(this.amounts());
  }
}
