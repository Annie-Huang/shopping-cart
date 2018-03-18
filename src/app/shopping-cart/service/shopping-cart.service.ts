import { Injectable } from '@angular/core';
import {Product} from '../../store/service/product';
import {ShoppingCart} from './shopping-cart';
import {CartItem} from './cart-item';
import {Subject} from 'rxjs/Subject';
import {PricingRule} from './pricing-rule';
import * as _ from 'lodash';
import {PriceCalculator} from '../utils/price-calculator';

@Injectable()
export class ShoppingCartService {

    cart: ShoppingCart = new ShoppingCart();
    pricingRules: PricingRule[] = null;

    // Setup subject for broadcast event.
    private _shoppingCartSource = new Subject<ShoppingCart | null>();
    shoppingCartSourceChanges$ = this._shoppingCartSource.asObservable();

    constructor() {
        this.cart.total = 0;
    }

    public setPricingRules(pricingRules: PricingRule[]): void {
        this.pricingRules = pricingRules;
    }

    public calculateCart(cart: ShoppingCart, pricingRules: PricingRule[]): void {
        cart.items.forEach(cartItem => {
            const rule: PricingRule = pricingRules ?
                pricingRules.find((pricingRule) => pricingRule.productId === cartItem.product.id) : null;
            PriceCalculator.calculateCartItemPrice(cartItem, rule);
        });
        cart.total = Number(_.sumBy(cart.items, 'subTotal').toFixed(2));
    }

    public addItem(product: Product): void {
        let item: CartItem = this.cart.items.find((cartItem) => cartItem.product.id === product.id);
        if (item === undefined) {
            item = new CartItem();
            item.product = product;
            this.cart.items.push(item);
        }
        item.quantity += 1;

        this.calculateCart(this.cart, this.pricingRules);
        // broadcast event.
        this._shoppingCartSource.next(this.cart);
    }

    public removeItem(product: Product): void {
        const item = this.cart.items.find((cartItem) => cartItem.product.id === product.id);
        item.quantity -= 1;
        this.cart.items = this.cart.items.filter((cartItem) => cartItem.quantity > 0);

        this.calculateCart(this.cart, this.pricingRules);
        // broadcast event.
        this._shoppingCartSource.next(this.cart);
    }

}
