import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpressaoNotaResponse, NotaFiscal, NotaFiscalCriarItem } from '../features/notas/notas-model';
import { BaseApiService } from './base/base-api.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotasApiService extends BaseApiService {

	listar(): Observable<NotaFiscal[]> {
		return this.get<NotaFiscal>('notas');
	}

	criar(payload: NotaFiscalCriarItem): Observable<NotaFiscal> {
		return this.post<NotaFiscal>('notas', payload);
	}

	imprimir(notaId: number, idempotencyKey: string): Observable<ImpressaoNotaResponse> {
		const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
		return this.post<ImpressaoNotaResponse>(`notas/${notaId}/imprimir`, {}, { headers });
	}

}
