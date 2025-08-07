import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'questionnaire',
    loadComponent: () =>
      import('./features/questionnaire/questionnaire-container/questionnaire-container.component')
      .then(m => m.QuestionnaireContainerComponent)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./features/analysis/analysis.component').then(m => m.AnalysisComponent)
  },
  {
    path: '**',
    redirectTo: '',
  }
];
