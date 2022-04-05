import { createContext, useContext, useState } from "react";
import { Item, UserS } from "../types/index";

import axios from "axios";
import Cookies from "js-cookie";

type Cart = {
  cartItems: Item[];
  address: { fullName: string; address: string; city: string; postalCode: string; country: string };
  paymentMethod: string;
};

interface AppContextTypes {
  darkMode: boolean;
  changeTheme: () => void;
  handleAddToCart: (product: Item) => Promise<void>;
  handleSelectQuantity: (item: Item, quantity: any) => Promise<void>;
  handleDeleteFromCart: (item: Item) => void;
  setCart: (data: any) => void;
  cart: Cart;
  userInfo: UserS | null;
  setUserInfo: (data: any) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextTypes>(null!);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState({
    cartItems: [],
    address: Cookies.get("shippingAddress") ? JSON.parse(Cookies.get("shippingAddress")!) : {},
    paymentMethod: "",
  });
  const [userInfo, setUserInfo] = useState<UserS | null>(
    Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")!) : null
  );

  const handleAddToCart = async (product: Item): Promise<void> => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert("out of stock");
      return;
    }
    let newData: Item = { ...data, quantity: 1 };
    console.log(newData);
    const existItem = cart.cartItems.find((item: Item) => item._id === data._id);

    const cartItems = existItem
      ? cart.cartItems.map((item: Item) => (item.name === existItem.name ? newData : item))
      : [...cart.cartItems, newData];

    setCart({ ...cart, cartItems });
  };
  const handleSelectQuantity = async (item: Item, quantity: number): Promise<void> => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock <= 0) {
      window.alert("out of stock");
      return;
    }

    const items = cart.cartItems;
    const newData2 = items.map((el: Item) => {
      if (el._id === item._id) {
        return { ...item, quantity: quantity };
      }
      return el;
    });
    setCart({ ...cart, cartItems: [...newData2] });
  };
  const handleDeleteFromCart = (item: Item): void => {
    const newData = cart.cartItems.filter((el: Item) => el._id != item._id);
    setCart({ ...cart, cartItems: [...newData] });
  };

  const changeTheme = () => {
    setDarkMode(!darkMode);
  };

  const clearCart = () => {
    setCart({ ...cart, cartItems: [] });
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        changeTheme,
        cart,
        setCart,
        handleAddToCart,
        handleSelectQuantity,
        handleDeleteFromCart,
        userInfo,
        setUserInfo,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
