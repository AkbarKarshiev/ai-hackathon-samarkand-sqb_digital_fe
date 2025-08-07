import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../../../core/api/services/api.service";
import { AddExpensesPayload, AddIncomesPayload, BalancePayload, CreateUserResponse, FamilyInfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly apiService = inject(ApiService);

  public createUser(payload: FamilyInfo): Observable<CreateUserResponse> {
    return this.apiService.post<FamilyInfo, CreateUserResponse>('/users/register', payload);
  }

  public addExpenses(userId: number, payload: AddExpensesPayload): Observable<void> {
    return this.apiService.post<AddExpensesPayload, void>(`/expenses/${userId}/add-expenses`, payload);
  }

  public addIncomes(userId: number, payload: AddIncomesPayload): Observable<void> {
    return this.apiService.post<AddIncomesPayload, void>(`/incomes/${userId}/add-incomes`, payload);
  }

  public addBalance(userId: number, payload: BalancePayload): Observable<void> {
    return this.apiService.post<BalancePayload, void>(`/users/${userId}/add-balance`, payload);
  }
}
