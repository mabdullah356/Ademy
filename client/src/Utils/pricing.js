/**
 * Pricing Utility to handle consistent discount calculations across the app.
 * Logic: Final Price = Original Price - (Original Price * Discount / 100)
 */

export const calculateDiscountedPrice = (price, discount) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    if (d <= 0) return p;
    if (d >= 100) return 0;
    return p * (1 - d / 100);
};

export const calculateSavings = (price, discount) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    if (d <= 0) return 0;
    return p * (d / 100);
};

export const formatCurrency = (amountInCents) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amountInCents / 100);
};
