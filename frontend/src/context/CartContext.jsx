import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (course) => {
    setCart((prev) => {
      if (prev.find((c) => c._id === course._id)) return prev;
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCart((prev) => prev.filter((c) => c._id !== courseId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (courseId) => cart.some((c) => c._id === courseId);

  const total = cart.reduce((sum, c) => sum + (c.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
