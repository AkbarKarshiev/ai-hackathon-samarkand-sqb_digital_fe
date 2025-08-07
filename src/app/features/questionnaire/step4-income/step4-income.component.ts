import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize } from 'rxjs/operators';

import { LocalStorageService } from '../../../core/storage/services';
import { AddIncomesPayload, IncomeItem } from '../models';
import { IncomeInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';
import { QuestionnaireService } from '../services';

interface IncomeFormControls {
  salary: FormControl<number>;
  otherIncome: FormControl<number>;
}

const INCOME_FORM_KEYS = {
  Salary: 'salary',
  OtherIncome: 'otherIncome'
} as const;

@Component({
  selector: 'app-step4-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step4-income.component.html'
})

export class Step4IncomeComponent {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly questionnaireService = inject(QuestionnaireService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Input for previously entered income data (for persistence when navigating back)
  public initialIncomeData = input<IncomeInfo>({ salary: 0, otherIncome: 0 });
  public readonly formKeys = INCOME_FORM_KEYS;

  public isSubmitting = signal(false);
  public completed = output<IncomeInfo>();
  public goBack = output<void>();

  // Reactive Form using FormGroup
  public form = new FormGroup<IncomeFormControls>({
    [INCOME_FORM_KEYS.Salary]: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    [INCOME_FORM_KEYS.OtherIncome]: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)]
    })
  });

  constructor() {
    // Initialize form with input data when it changes
    effect(() => {
      const incomeData = this.initialIncomeData();
      this.form.patchValue({
        [INCOME_FORM_KEYS.Salary]: incomeData.salary,
        [INCOME_FORM_KEYS.OtherIncome]: incomeData.otherIncome
      });
    });
  }

  private isValid(): boolean {
    return this.form.valid;
  }

  private convertFormValueToPayload(): AddIncomesPayload {
    const formValues = this.form.value;
    const payload: AddIncomesPayload = [];

    // Add salary income item
    if (formValues.salary && formValues.salary > 0) {
      const salaryItem: IncomeItem = {
        name: 'salary',
        amount: formValues.salary
      };
      payload.push(salaryItem);
    }

    // Add other income item
    if (formValues.otherIncome && formValues.otherIncome > 0) {
      const otherIncomeItem: IncomeItem = {
        name: 'other-income',
        amount: formValues.otherIncome
      };
      payload.push(otherIncomeItem);
    }

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
      this.isSubmitting.set(false);
      return;
    }

    const payload = this.convertFormValueToPayload();

    this.questionnaireService.addIncomes(userId, payload).pipe(
      finalize(() => {
        this.isSubmitting.set(false);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        const incomeData: IncomeInfo = {
          salary: this.form.value[INCOME_FORM_KEYS.Salary]!,
          otherIncome: this.form.value[INCOME_FORM_KEYS.OtherIncome]!
        };
        this.completed.emit(incomeData);
      }
    });
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
