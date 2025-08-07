import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { EXPENSE_CATEGORIES } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

@Component({
  selector: 'app-step3-expense-amounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step3-expense-amounts.component.html'
})
export class Step3ExpenseAmountsComponent {
  public selectedCategoryIds = input.required<string[]>();
  // Input for previously entered amounts (for persistence when navigating back)
  public initialAmounts = input<Record<string, number>>({});

  public isSubmitting = signal(false);
  public completed = output<Record<string, number>>();
  public goBack = output<void>();

  public selectedCategoriesData = computed(() => {
    return EXPENSE_CATEGORIES.filter(cat =>
      this.selectedCategoryIds().includes(cat.id)
    );
  });

  // Dynamic Reactive Form
  public form = new FormGroup({});

    constructor() {
    // Create form controls when selectedCategoryIds changes
    effect(() => {
      const categoryIds = this.selectedCategoryIds();
      const amounts = this.initialAmounts();

      // Clear existing controls
      Object.keys(this.form.controls).forEach(key => {
        this.form.removeControl(key);
      });

      // Add new controls for each category with stored values
      categoryIds.forEach(categoryId => {
        const initialValue = amounts[categoryId] || 0;
        this.form.addControl(categoryId, new FormControl(initialValue, {
          validators: [Validators.required, Validators.min(1)]
        }));
      });
    });
  }

  private isValid(): boolean {
    return this.form.valid;
  }

  public async handleNext(): Promise<void> {
    // Mark all fields as touched to trigger validation display
    this.form.markAllAsTouched();

    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    this.isSubmitting.set(false);

    // Emit the form values
    this.completed.emit(this.form.value as Record<string, number>);
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
