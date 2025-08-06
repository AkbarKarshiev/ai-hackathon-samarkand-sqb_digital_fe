import { Routes } from '@angular/router';
import { QuestionnaireContainerComponent } from './features/questionnaire/questionnaire-container/questionnaire-container.component';

export const routes: Routes = [
  {
    path: '',
    component: QuestionnaireContainerComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  }
];
