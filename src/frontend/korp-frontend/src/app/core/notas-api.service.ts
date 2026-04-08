import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpressaoNotaResponse, NotaFiscal } from './models';

@Injectable({ providedIn: 'root' })
export class NotasApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:5102/api/notas';

	listar(): Observable<NotaFiscal[]> {
		return this.http.get<NotaFiscal[]>(this.baseUrl);
	}

	criar(payload: { itens: { produtoId: number; descricaoProduto: string; quantidade: number }[] }): Observable<NotaFiscal> {
		return this.http.post<NotaFiscal>(this.baseUrl, payload);
	}

	imprimir(notaId: number, idempotencyKey: string): Observable<ImpressaoNotaResponse> {
		const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
		return this.http.post<ImpressaoNotaResponse>(`${this.baseUrl}/${notaId}/imprimir`, {}, { headers });
	}
}
