export interface Attribute {
    name: string;
    value: number;
}

export interface PricingRule {
    ruleName: string;
    productId: string;
    attributes: Attribute[];
}
