import { Routes } from '@angular/router';
import { ProdutosPageComponent } from './Pages/produtos/produtos-page.component';
import { ProdutosEditar } from './Pages/produtos/produtos-editar/produtos-editar';
import { ProdutosNovo } from './Pages/produtos/produtos-novo/produtos-novo';
import { ProdutosExcluir } from './Pages/produtos/produtos-excluir/produtos-excluir';
import { RotaNotaFiscal } from './Pages/nota-fiscal/nota-fiscal';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'produtos' },
	{
		path: 'produtos',
		component: ProdutosPageComponent,
		children: [
			{ path: 'novo', component: ProdutosNovo },
			{ path: 'editar/:id', component: ProdutosEditar },
			{ path: 'excluir/:id', component: ProdutosExcluir },
		],
	},
	{
		path: 'notas',
		component: RotaNotaFiscal,
		children: [
			// { path: 'novo', component: NotaFiscalNovo },
			// { path: 'editar/:id', component: NotaFiscalEditar },
			// { path: 'excluir/:id', component: NotaFiscalExcluir },
		],
	}
];
