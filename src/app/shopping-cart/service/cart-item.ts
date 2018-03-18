import {Product} from '../../store/service/product';

export class CartItem {
    public product: Product;
    public quantity = 0;
    public subTotal = 0;
}
