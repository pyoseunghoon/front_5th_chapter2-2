import { CartPage } from './ui/userPage/CartPage.tsx';
import { AdminPage } from './ui/adminPage/AdminPage.tsx';
import { useCoupons, useProducts } from './hooks';
import { Nav } from './ui/Nav.tsx';
import { useNav } from './hooks/useNav.ts';
import { initialProducts } from './models/product.ts';
import { initialCoupons } from './models/coupon.ts';

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const { isAdmin, switchPage } = useNav(false);

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
