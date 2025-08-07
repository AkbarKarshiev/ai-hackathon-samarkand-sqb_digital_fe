import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize } from 'rxjs/operators';

import { LocalStorageService } from '../../../core/storage/services';
import { BalancePayload } from '../models';
import { BalanceInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';
import { QuestionnaireService } from '../services';

interface BalanceFormControls {
  currentBalance: FormControl<number>;
}

const BALANCE_FORM_KEYS = {
  CurrentBalance: 'currentBalance'
} as const;

@Component({
  selector: 'app-step5-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, QuestionnaireLayoutComponent],
  templateUrl: './step5-balance.component.html'
})
export class Step5BalanceComponent {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly questionnaireService = inject(QuestionnaireService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Input for previously entered balance data (for persistence when navigating back)
  public initialBalanceData = input<BalanceInfo>({ currentBalance: 0 });
  public readonly formKeys = BALANCE_FORM_KEYS;

  public isSubmitting = signal(false);
  public completed = output<BalanceInfo>();
  public goBack = output<void>();

  // Reactive Form using FormGroup
  public form = new FormGroup<BalanceFormControls>({
    [BALANCE_FORM_KEYS.CurrentBalance]: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    })
  });

  constructor() {
    // Initialize form with input data when it changes
    effect(() => {
      const balanceData = this.initialBalanceData();
      this.form.patchValue({
        [BALANCE_FORM_KEYS.CurrentBalance]: balanceData.currentBalance
      });
    });
  }

  private isValid(): boolean {
    return this.form.valid;
  }

  private convertFormValueToPayload(): BalancePayload {
    const formValues = this.form.value;
    const payload: BalancePayload = {
      balance: formValues.currentBalance || 0
    };

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

    this.questionnaireService.addBalance(userId, payload).pipe(
      finalize(() => {
        this.isSubmitting.set(false);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        const balanceData: BalanceInfo = {
          currentBalance: this.form.value[BALANCE_FORM_KEYS.CurrentBalance]!
        };
        this.completed.emit(balanceData);
      }
    });
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
