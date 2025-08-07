import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

import { DEPENDENTS_OPTIONS, FamilyInfo, MARITAL_STATUS_OPTIONS } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

// Form interface and keys
interface FamilyFormControls {
  maritalStatus: FormControl<string>;
  dependents: FormControl<number>;
}

const FAMILY_FORM_KEYS = {
  MaritalStatus: 'maritalStatus',
  Dependents: 'dependents'
} as const;

@Component({
  selector: 'app-step1-family',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    QuestionnaireLayoutComponent,
    InputNumber,
  ],
  templateUrl: './step1-family.component.html',
})
export class Step1FamilyComponent {
  // Input for previously entered family data (for persistence when navigating back)
  public initialFamilyData = input<FamilyInfo>({ maritalStatus: '', dependents: 0 });

  public readonly maritalStatusOptions = MARITAL_STATUS_OPTIONS;
  public readonly dependentsOptions = DEPENDENTS_OPTIONS;
  public readonly formKeys = FAMILY_FORM_KEYS;

  public isSubmitting = signal(false);

  public completed = output<FamilyInfo>();
  public goBack = output<void>();

  // Reactive Form using FormGroup directly
  public form = new FormGroup<FamilyFormControls>({
    [FAMILY_FORM_KEYS.MaritalStatus]: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    [FAMILY_FORM_KEYS.Dependents]: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    // Initialize form with input data when it changes
    effect(() => {
      const familyData = this.initialFamilyData();
      this.form.patchValue({
        [FAMILY_FORM_KEYS.MaritalStatus]: familyData.maritalStatus,
        [FAMILY_FORM_KEYS.Dependents]: familyData.dependents,
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.isSubmitting.set(false);

    // Emit the form value that matches FamilyInfo interface
    const familyData: FamilyInfo = {
      maritalStatus: this.form.value[FAMILY_FORM_KEYS.MaritalStatus]!,
      dependents: this.form.value[FAMILY_FORM_KEYS.Dependents]!,
    };

    this.completed.emit(familyData);
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
