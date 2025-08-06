import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-questionnaire-layout',
  standalone: true,
  imports: [ProgressBarModule, ButtonModule],
  templateUrl: './questionnaire-layout.component.html'
})
export class QuestionnaireLayoutComponent {
  private readonly router = inject(Router);
  public showHeader = input(true);
  public isSubmitting = input(false);
  public nextButtonText = input('Далее');
  public title = input('Финансовый анализ');

  public nextClicked = output<void>();

  public goBack(): void {
    this.router.navigate(['/welcome']);
  }

  public onNext(): void {
    this.nextClicked.emit();
  }
}
