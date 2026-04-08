import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../Pages/produtos/protudos-model';
import { BaseApiService } from './base/base-api.service';

@Injectable({ providedIn: 'root' })
export class ProdutosApiService extends BaseApiService {

	public controleReloadListagem = signal(false);

	listar(): Observable<Produto[]> {
		return this.get<Produto>('produtos');
	}

	criar(payload: { codigo: string; descricao: string; saldo: number }): Observable<Produto> {
		return this.post<Produto>('produtos', payload);
	}
}
