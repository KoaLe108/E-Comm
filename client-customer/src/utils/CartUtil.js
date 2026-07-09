const CartUtil = {
    getTotal(mycart) {
        var total = 0;
        for (const intem of mycart) {
            total += intem.product.price * intem.quantity;
        }
        return total;
    }
};
export default CartUtil;