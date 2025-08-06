import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { QuestionnaireLayoutComponent } from '../questionnaire-layout/questionnaire-layout.component';
import { EXPENSE_CATEGORIES } from '../models/questionnaire.types';

@Component({
  selector: 'app-step2-expense-categories',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, QuestionnaireLayoutComponent],
  templateUrl: './step2-expense-categories.component.html'
})
export class Step2ExpenseCategoriesComponent {
  categories = EXPENSE_CATEGORIES;
  selectedCategories = signal<string[]>([]);
  isSubmitting = signal(false);

  completed = output<string[]>();

  toggleCategory(categoryId: string): void {
    const current = this.selectedCategories();
    const index = current.indexOf(categoryId);

    if (index === -1) {
      this.selectedCategories.set([...current, categoryId]);
    } else {
      this.selectedCategories.set(current.filter(id => id !== categoryId));
    }
  }

  getCategoryClasses(categoryId: string): string {
    const isSelected = this.selectedCategories().includes(categoryId);
    return isSelected
      ? 'bg-blue-500 text-white shadow-lg'
      : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300';
  }

  getCategoryWord(): string {
    const count = this.selectedCategories().length;
    if (count === 1) return 'категория';
    if (count >= 2 && count <= 4) return 'категории';
    return 'категорий';
  }

  isValid(): boolean {
    return this.selectedCategories().length > 0;
  }

  async handleNext(): Promise<void> {
    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isSubmitting.set(false);

    this.completed.emit(this.selectedCategories());
  }
}
