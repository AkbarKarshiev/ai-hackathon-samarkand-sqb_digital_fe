import { inject, Injectable } from '@angular/core';
import { catchError,forkJoin, Observable, of } from 'rxjs';

import { ApiService } from '../../../core/api/services/api.service';
import { AiAdviceResponse, CalculationResponse, MainInfoResponse } from '../models/analysis.types';

export interface AnalysisApiResponse {
  mainInfo: MainInfoResponse | null;
  calculation: CalculationResponse | null;
  aiAdvice: AiAdviceResponse | null;
  // Add other API responses here as they become available
  // Example additional endpoints:
  // recommendations: RecommendationsResponse | null;
  // insights: InsightsResponse | null;
  // predictions: PredictionsResponse | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly apiService = inject(ApiService);

  public getMainInfo(userId: string): Observable<MainInfoResponse | null> {
    return this.apiService.get<MainInfoResponse>(`/users/${userId}/get-main-info`)
      .pipe(
        catchError(error => {
          console.error('Failed to fetch main info:', error);
          return of(null);
        })
      );
  }

  public getCalculation(userId: string): Observable<CalculationResponse | null> {
    return this.apiService.get<CalculationResponse>(`/calculation/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Failed to fetch calculation:', error);
          return of(null);
        })
      );
  }

  public getAiAdvice(userId: string): Observable<AiAdviceResponse | null> {
    return this.apiService.post<object, AiAdviceResponse>(`/ai/advice/${userId}`, {})
      .pipe(
        catchError(error => {
          console.error('Failed to fetch AI advice:', error);
          return of(null);
        })
      );
  }

  public getAllAnalysisData(userId: string): Observable<AnalysisApiResponse> {
    // Combine all API calls here
    const mainInfoCall = this.getMainInfo(userId);
    const calculationCall = this.getCalculation(userId);
    const aiAdviceCall = this.getAiAdvice(userId);

    // Add more API calls here as they become available
    // const additionalCall = this.getAdditionalData(userId);

    return forkJoin({
      mainInfo: mainInfoCall,
      calculation: calculationCall,
      aiAdvice: aiAdviceCall,
      // additional: additionalCall,
    });
  }
}
