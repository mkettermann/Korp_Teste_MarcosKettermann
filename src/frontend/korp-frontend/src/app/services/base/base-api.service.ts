import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
	abstract portaApi: string;

	private readonly http = inject(HttpClient);
	private readonly host = 'http://localhost:';
	private readonly apiVersion = `/api`;

	// REST API common methods

	get<T>(url: string): Observable<T[]> {
		return this.http.get<T[]>(`${this.host}${this.portaApi}${this.apiVersion}/${url}`)
			.pipe(map((res) => {
				console.log('GET', `${this.host}${this.portaApi}${this.apiVersion}/${url}`, res);
				return res;
			}));
	}

	post<T>(url: string, payload: any, options?: { headers?: HttpHeaders }): Observable<T> {
		console.log('POST', `${this.host}${this.portaApi}${this.apiVersion}/${url}`, payload);
		return this.http.post<T>(`${this.host}${this.portaApi}${this.apiVersion}/${url}`, payload, options);
	}

	put<T>(url: string, payload: any, options?: { headers?: HttpHeaders }): Observable<T> {
		console.log('PUT', `${this.host}${this.portaApi}${this.apiVersion}/${url}`, payload);
		return this.http.put<T>(`${this.host}${this.portaApi}${this.apiVersion}/${url}`, payload, options);
	}

	delete<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
		console.log('DELETE', `${this.host}${this.portaApi}${this.apiVersion}/${url}`);
		return this.http.delete<T>(`${this.host}${this.portaApi}${this.apiVersion}/${url}`, options);
	}

}
