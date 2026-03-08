import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ImageKitProvider } from "@imagekit/react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminUsers from "./pages/admin/AdminUsers";
import ReturnRefundPolicy from "./pages/policies/ReturnRefundPolicy";
import DeliveryPolicy from "./pages/policies/DeliveryPolicy";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <ImageKitProvider urlEndpoint="https://ik.imagekit.io/mn97a0qq9f">
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Store routes */}
                <Route path="/" element={<><Navbar /><Index /><Footer /></>} />
                <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
                <Route path="/product/:slug" element={<><Navbar /><ProductDetail /><Footer /></>} />
                <Route path="/categories" element={<><Navbar /><Categories /><Footer /></>} />
                <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
                <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
                <Route path="/partner" element={<><Navbar /><Partner /><Footer /></>} />
                <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
                <Route path="/account" element={<><Navbar /><Account /><Footer /></>} />

                {/* Policy routes */}
                <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
                <Route path="/delivery-policy" element={<DeliveryPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminAddProduct />} />
                  <Route path="products/edit/:id" element={<AdminEditProduct />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="partners" element={<AdminPartners />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ImageKitProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
