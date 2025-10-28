import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import './index.css'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import { WishlistProvider } from './context/WishlistContext' // ✅ Add this import
import { ContentProvider } from './context/ContentContext'
import { ProductProvider } from './context/ProductContext'
import { CategoryProvider } from './context/CategoryContext'
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <ContentProvider>
            <ProductProvider>
               <CategoryProvider>
          <WishlistProvider> {/* ✅ Add WishlistProvider here */}
            <BrowserRouter>
                  <AppRoutes></AppRoutes>
                  </BrowserRouter>
          </WishlistProvider>
          </CategoryProvider>
          </ProductProvider>
          </ContentProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  </React.StrictMode>,
)
