/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
// import { Provider } from "react";
import { food_list } from "../../assets/assets";
export const StoreContext = createContext(null);
const StoreContextMain = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const addToCart = (itemId) => {
    // console.log(cartItems);
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };
  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems]);
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    removeFromCart,
    addToCart,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
