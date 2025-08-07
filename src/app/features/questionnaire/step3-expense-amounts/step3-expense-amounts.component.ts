import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize } from 'rxjs/operators';

import { LocalStorageService } from '../../../core/storage/services';
import { AddExpensesPayload, ExpenseItem } from '../models';
import { EXPENSE_CATEGORIES } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';
import { QuestionnaireService } from '../services';

@Component({
  selector: 'app-step3-expense-amounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step3-expense-amounts.component.html'
})
export class Step3ExpenseAmountsComponent {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly questionnaireService = inject(QuestionnaireService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

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

  private convertFormValueToPayload(): AddExpensesPayload {
    const formValues = this.form.value as Record<string, number>;
    const payload: AddExpensesPayload = [];

    Object.entries(formValues).forEach(([categoryId, amount]) => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
      if (category && amount) {
        const expenseItem: ExpenseItem = {
          name: category.name,
          amount: amount,
          importantStatus: 'High'
        };
        payload.push(expenseItem);
      }
    });

    return payload;
  }

  public handleNext(): void {
    // Mark all fields as touched to trigger validation display
    this.form.markAllAsTouched();

    if (!this.isValid()) return;

    this.isSubmitting.set(true);

    const userId = this.localStorageService.getItem<number>('userId');
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не найден ID пользователя',
        life: 3000
      });
      return;
    }

    const payload = this.convertFormValueToPayload();

    this.questionnaireService.addExpenses(userId, payload).pipe(
      finalize(() => {
        this.isSubmitting.set(false);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.completed.emit(this.form.value as Record<string, number>);
      }
    });
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
