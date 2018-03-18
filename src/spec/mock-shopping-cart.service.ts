import {Product} from '../app/store/service/product';
import {Observable} from 'rxjs/Observable';
import {CartItem} from '../app/shopping-cart/service/cart-item';
import {ShoppingCart} from '../app/shopping-cart/service/shopping-cart';
import {ShoppingCartService} from '../app/shopping-cart/service/shopping-cart.service';
import {SpyObject} from './helper';
import Spy = jasmine.Spy;

declare var require: any;
export class MockShoppingCartService extends SpyObject {
    addItem: Spy;
    removeItem: Spy;
    setPricingRules: Spy;
    shoppingCartSourceChanges$: Observable<ShoppingCart>;

    constructor() {
        super( ShoppingCartService );
        this.addItem = this.spy('addItem').andReturn(this);
        this.removeItem = this.spy('removeItem').andReturn(this);
        this.setPricingRules = this.spy('setPricingRules').andReturn(this);

        const cart: ShoppingCart = new ShoppingCart();
        const cartItem: CartItem = new CartItem();
        const products: Product[] = require('../resources/fixtures/products.json');
        cartItem.product = products[0];
        cart.items.push(cartItem);
        this.shoppingCartSourceChanges$ = Observable.of(cart);
    }
}
