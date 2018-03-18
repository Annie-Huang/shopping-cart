import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from './service/product.service';
import {Product} from './service/product';
import {UserService} from './service/user.service';
import {User} from './service/user';
import {ShoppingCartService} from '../shopping-cart/service/shopping-cart.service';
import {Subscription} from 'rxjs/Subscription';
import {PricingRule} from '../shopping-cart/service/pricing-rule';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

    private _userId = 'Ford';
    private _sub: Subscription;

    products: Product[] = null;
    user: User = null;
    pricingRules: string[] = [];

    constructor(private _productService: ProductService, private _userService: UserService,
                private _shoppingCartService: ShoppingCartService) { }

    ngOnInit() {
        this.loadProducts();
        this.loadUser();

        this._sub = this._shoppingCartService.shoppingCartSourceChanges$.subscribe(cart => {
            this.products.forEach(product => {
                product.productInCart = cart.items.some((cartItem) => cartItem.product.id === product.id);
            });
        });
    }

    private loadProducts() {
        this._productService.getAll().subscribe(products => {
              this.products = products;
        }, error => console.log(error));
    }

    private loadUser() {
        this._userService.getUserById(this._userId).subscribe(user => {
            this.user = user;
            this._shoppingCartService.setPricingRules(this.user.pricingRules);
            this.setPricingRulesForDisplay(this.user.pricingRules);
        }, error => console.log(error));
    }

    setPricingRulesForDisplay(rules: PricingRule[]): void {
        this.pricingRules = [];
        if (rules) {
            rules.forEach(rule => {
                let newPrice: number;
                const productname: string = this.products.find((product) => product.id === rule.productId).name;
                if (rule.ruleName === 'buyXQtyForYQtyPrice') {
                    const xQty: number = rule.attributes.find((attr) => attr.name === 'xQty').value;
                    const yQty: number = rule.attributes.find((attr) => attr.name === 'yQty').value;
                    this.pricingRules.push('Gets a **' + xQty + ' for ' + yQty + ' deal on ' + productname + 's**');
                } else if (rule.ruleName === 'newUnitPrice') {
                    newPrice = rule.attributes.find((attr) => attr.name === 'newPrice').value;
                    this.pricingRules.push('Gets a discount on **' + productname + 's where the price drops to $' + newPrice + ' per ad**');
                } else if (rule.ruleName === 'newUnitPriceWithMinQty') {
                    newPrice = rule.attributes.find((attr) => attr.name === 'newPrice').value;
                    const minQty: number = rule.attributes.find((attr) => attr.name === 'minQty').value;
                    this.pricingRules.push('Gets a discount on **' + productname + 's when ' + minQty +
                        ' or more** are purchased. The price drops to **$' + newPrice + ' per ad**');
                }
            });
        }
    }

    addProductToCart(product: Product): void {
        this._shoppingCartService.addItem(product);
    }

    removeProductFromCart(product: Product): void {
        this._shoppingCartService.removeItem(product);
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
