import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';

import { ExpenseIconComponent } from '../../../shared/components/expense-icon/expense-icon.component';
import { EXPENSE_CATEGORIES } from '../models/questionnaire.types';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';

@Component({
  selector: 'app-step2-expense-categories',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ToastModule, QuestionnaireLayoutComponent, ExpenseIconComponent],
  providers: [MessageService],
  templateUrl: './step2-expense-categories.component.html'
})
export class Step2ExpenseCategoriesComponent {
  private readonly messageService = inject(MessageService);

  // Input for previously selected categories (for persistence when navigating back)
  public initialSelectedCategories = input<string[]>([]);

  public readonly categories = EXPENSE_CATEGORIES;
  public selectedCategories = signal<string[]>([]);
  public isSubmitting = signal(false);

  public completed = output<string[]>();
  public goBack = output<void>();

  constructor() {
    // Initialize selectedCategories with input data when it changes
    effect(() => {
      this.selectedCategories.set(this.initialSelectedCategories());
    });
  }

  public toggleCategory(categoryId: string): void {
    const current = this.selectedCategories();
    const index = current.indexOf(categoryId);

    if (index === -1) {
      this.selectedCategories.set([...current, categoryId]);
    } else {
      this.selectedCategories.set(current.filter(id => id !== categoryId));
    }
  }

  public getCategoryClasses(categoryId: string): string {
    const isSelected = this.selectedCategories().includes(categoryId);
    return isSelected
      ? 'bg-sky-500 text-white shadow-lg'
      : 'bg-blue-50 text-gray-900';
  }

  public getCategoryWord(): string {
    const count = this.selectedCategories().length;
    if (count === 1) return 'категория';
    if (count >= 2 && count <= 4) return 'категории';
    return 'категорий';
  }

  public isValid(): boolean {
    return this.selectedCategories().length > 0;
  }

  public async handleNext(): Promise<void> {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не выбрана ни одна категория',
        life: 3000
      });
      return;
    }

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isSubmitting.set(false);

    this.completed.emit(this.selectedCategories());
  }

  public handleGoBack(): void {
    this.goBack.emit();
  }
}
