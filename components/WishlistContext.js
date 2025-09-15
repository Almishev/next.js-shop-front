import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WishlistContext = createContext({});

export const WishlistProvider = ({ children }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToWishlist = async (productId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Моля, влезте в акаунта си за да добавите продукти в желаните');
      return;
    }

    try {
      await axios.post('/api/wishlist', {
        productId,
        email: userEmail
      });
      
      // Fetch updated wishlist
      await fetchWishlist(userEmail);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Грешка при добавяне в желаните');
    }
  };

  const removeFromWishlist = async (productId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      await axios.delete('/api/wishlist', {
        data: { productId, email: userEmail }
      });
      
      // Fetch updated wishlist
      await fetchWishlist(userEmail);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Грешка при премахване от желаните');
    }
  };

  const fetchWishlist = useCallback(async (email) => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/wishlist?email=${email}`);
      setWishlistProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const isInWishlist = (productId) => {
    return wishlistProducts.some(item => item._id === productId);
  };

  const getWishlistCount = () => {
    return wishlistProducts.length;
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetchWishlist(userEmail);
    }
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlistProducts,
      loading,
      addToWishlist,
      removeFromWishlist,
      fetchWishlist,
      isInWishlist,
      getWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
