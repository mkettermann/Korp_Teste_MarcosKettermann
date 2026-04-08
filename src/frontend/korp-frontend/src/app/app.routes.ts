import { Routes } from '@angular/router';
import { NotasPageComponent } from './features/notas/notas-page.component';
import { ProdutosPageComponent } from './features/produtos/produtos-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'produtos' },
	{ path: 'produtos', component: ProdutosPageComponent },
	{ path: 'notas', component: NotasPageComponent }
];
