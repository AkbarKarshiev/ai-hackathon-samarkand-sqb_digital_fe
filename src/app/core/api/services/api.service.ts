import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { EnvironmentService } from "../../environment/services/environment.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly environmentService = inject(EnvironmentService);

  private addAppHostUrl(path: string): string {
    return `${this.environmentService.apiUrl}/api${path}`;
  }

  public get<T = void>(url: string, options?: Record<string, any>): Observable<T> {
    return this.http.get<T>(this.addAppHostUrl(url), options);
  }

  public post<T = void, U = T>(url: string, payload: T, options?: Record<string, any>): Observable<U> {
    return this.http.post<U>(this.addAppHostUrl(url), payload, options);
  }

  public put<T = void, U = T>(url: string, payload: T, options?: Record<string, any>): Observable<U> {
    return this.http.put<U>(this.addAppHostUrl(url), payload, options);
  }

  public delete<T = void>(url: string, options?: Record<string, any>): Observable<T> {
    return this.http.delete<T>(this.addAppHostUrl(url), options);
  }
}
