import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ShoppingCartService} from './service/shopping-cart.service';
import {ShoppingCart} from './service/shopping-cart';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

    cart: ShoppingCart;
    private _sub: Subscription;
    constructor(private _shoppingCartService: ShoppingCartService) { }

    ngOnInit() {
        this.cart = this._shoppingCartService.cart;
        this._sub = this._shoppingCartService.shoppingCartSourceChanges$.subscribe(cart => {
            this.cart = cart;
        });
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
