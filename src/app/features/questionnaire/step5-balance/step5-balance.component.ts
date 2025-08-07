import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { BalanceInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

// Form interface and keys
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

  public async handleNext(): Promise<void> {
    // Mark all fields as touched to trigger validation display
    this.form.markAllAsTouched();

    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Longer for final submission
    this.isSubmitting.set(false);

    // Emit the form value that matches BalanceInfo interface
    const balanceData: BalanceInfo = {
      currentBalance: this.form.value[BALANCE_FORM_KEYS.CurrentBalance]!
    };

    this.completed.emit(balanceData);
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
