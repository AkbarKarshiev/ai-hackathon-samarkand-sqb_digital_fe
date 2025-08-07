import { animate,style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject,signal } from '@angular/core';
import { Router } from '@angular/router';

import { BalanceInfo,FamilyInfo, IncomeInfo, QuestionnaireData } from '../models/questionnaire.types';
import { Step1FamilyComponent } from '../step1-family/step1-family.component';
import { Step2ExpenseCategoriesComponent } from '../step2-expense-categories/step2-expense-categories.component';
import { Step3ExpenseAmountsComponent } from '../step3-expense-amounts/step3-expense-amounts.component';
import { Step4IncomeComponent } from '../step4-income/step4-income.component';
import { Step5BalanceComponent } from '../step5-balance/step5-balance.component';

@Component({
  selector: 'app-questionnaire-container',
  standalone: true,
  imports: [
    CommonModule,
    Step1FamilyComponent,
    Step2ExpenseCategoriesComponent,
    Step3ExpenseAmountsComponent,
    Step4IncomeComponent,
    Step5BalanceComponent
  ],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './questionnaire-container.component.html'
})
export class QuestionnaireContainerComponent {
  private router = inject(Router);

  currentStep = signal(1);

  questionnaireData = signal<QuestionnaireData>({
    family: { maritalStatus: '', dependents: 0 },
    expenses: { selectedCategories: [], amounts: {} },
    income: { salary: 0, otherIncome: 0 },
    balance: { currentBalance: 0 }
  });

  onFamilyCompleted(familyInfo: FamilyInfo): void {
    this.questionnaireData.update(data => ({
      ...data,
      family: familyInfo
    }));
    this.currentStep.set(2);
  }

  onExpenseCategoriesCompleted(selectedCategories: string[]): void {
    this.questionnaireData.update(data => ({
      ...data,
      expenses: {
        ...data.expenses,
        selectedCategories
      }
    }));
    this.currentStep.set(3);
  }

  onExpenseAmountsCompleted(amounts: Record<string, number>): void {
    this.questionnaireData.update(data => ({
      ...data,
      expenses: {
        ...data.expenses,
        amounts
      }
    }));
    this.currentStep.set(4);
  }

  onIncomeCompleted(incomeInfo: IncomeInfo): void {
    this.questionnaireData.update(data => ({
      ...data,
      income: incomeInfo
    }));
    this.currentStep.set(5);
  }

  onBalanceCompleted(balanceInfo: BalanceInfo): void {
    this.questionnaireData.update(data => ({
      ...data,
      balance: balanceInfo
    }));

    // Submit data and navigate to analysis
    this.submitQuestionnaire();
  }

  onGoBack(): void {
    const current = this.currentStep();
    if (current === 1) {
      // Go back to welcome page from step 1
      this.router.navigate(['/welcome']);
    } else {
      // Go back to previous step
      this.currentStep.set(current - 1);
    }
  }

  private async submitQuestionnaire(): Promise<void> {
    try {
      // Here you would send the data to your API
      console.log('Questionnaire data:', this.questionnaireData());

      // Navigate to analysis page
      await this.router.navigate(['/analysis'], {
        state: { questionnaireData: this.questionnaireData() }
      });
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  }
}
