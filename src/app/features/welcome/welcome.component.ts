import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Button } from "primeng/button";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [Button],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  private router = inject(Router);

  async startQuestionnaire(): Promise<void> {
    await this.router.navigate(['/questionnaire']);
  }
}
