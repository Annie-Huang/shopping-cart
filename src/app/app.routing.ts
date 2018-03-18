import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StoreComponent} from './store/store.component';

export const routes: Routes = [
    {path: '', redirectTo: 'store', pathMatch: 'full'},
    {path: 'store', component: StoreComponent}
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);
