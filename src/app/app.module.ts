import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreComponent } from './store/store.component';
import { ProductService } from './store/service/product.service';
import {UrlConfig} from '../environments/url-config';
import {HttpClientModule} from '@angular/common/http';
import { UserService } from './store/service/user.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartService } from './shopping-cart/service/shopping-cart.service';
import {AppRoutingModule} from './app.routing';

declare var require: any;

@NgModule({
    declarations: [
        AppComponent,
        StoreComponent,
        ShoppingCartComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [ProductService, UrlConfig, UserService, ShoppingCartService],
    bootstrap: [AppComponent]
})
export class AppModule { }
