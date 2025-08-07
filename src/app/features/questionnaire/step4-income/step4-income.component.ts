import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { IncomeInfo } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

// Form interface and keys
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

  public async handleNext(): Promise<void> {
    // Mark all fields as touched to trigger validation display
    this.form.markAllAsTouched();

    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isSubmitting.set(false);

    // Emit the form value that matches IncomeInfo interface
    const incomeData: IncomeInfo = {
      salary: this.form.value[INCOME_FORM_KEYS.Salary]!,
      otherIncome: this.form.value[INCOME_FORM_KEYS.OtherIncome]!
    };

    this.completed.emit(incomeData);
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
