import { CartPage } from './ui/userPage/CartPage.tsx';
import { AdminPage } from './ui/adminPage/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks';
import { Nav } from './ui/Nav.tsx';
import { useNav } from './hooks/useNav.ts';
import { initialProducts } from './models/product.ts';
import { initialCoupons } from './models/coupon.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { Coupon, Product } from '../types.ts';

const App = () => {
  const { isAdmin, switchPage } = useNav(false);

  const { getItem, setItem } = useLocalStorage();
  setItem('products', initialProducts);
  setItem('coupons', initialCoupons);

  const { products, updateProduct, addProduct } = useProducts(
    getItem('products') as Product[],
  );

  const { coupons, addCoupon } = useCoupons(getItem('coupons') as Coupon[]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav isAdmin={isAdmin} switchPage={switchPage}></Nav>
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
