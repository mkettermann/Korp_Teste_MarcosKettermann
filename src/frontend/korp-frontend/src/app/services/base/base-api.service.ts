import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:5101/api';

	// REST API common methods

	get<T>(url: string): Observable<T[]> {
		return this.http.get<T[]>(`${this.baseUrl}/${url}`);
	}

	post<T>(url: string, payload: any, options?: { headers?: HttpHeaders }): Observable<T> {
		return this.http.post<T>(`${this.baseUrl}/${url}`, payload, options);
	}

	put<T>(url: string, payload: any, options?: { headers?: HttpHeaders }): Observable<T> {
		return this.http.put<T>(`${this.baseUrl}/${url}`, payload, options);
	}

	delete<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
		return this.http.delete<T>(`${this.baseUrl}/${url}`, options);
	}

}
