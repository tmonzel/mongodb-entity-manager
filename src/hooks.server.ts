import { initializeAdmin } from '$admin/boot.server';
import { registerEntityResolver } from '$admin/entity/resolver.server';
import { createHttpHandle } from '$admin/router';
import { CustomerEntity } from '$lib/customer/customer.entity';
import { CustomerResolver } from '$lib/customer/customer.resolver';
import { MediaObjectEntity } from '$lib/media-object';
import { OrderEntity } from '$lib/order/order.entity';
import { OrderItemResolver, OrderResolver } from '$lib/order/order.resolver';
import { ProductEntity } from '$lib/product/product.entity';

// Setup all admin data
initializeAdmin({
	customers: CustomerEntity,
	products: ProductEntity,
	orders: OrderEntity,
	media: MediaObjectEntity,
});

registerEntityResolver('Customer', CustomerResolver);
registerEntityResolver('Order', OrderResolver);
registerEntityResolver('OrderItem', OrderItemResolver);

export const handle = createHttpHandle();
