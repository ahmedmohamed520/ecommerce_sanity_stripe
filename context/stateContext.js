import { useContext } from "react";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity,
                    };
                }
                return cartProduct;
            });
            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (product) => {
        const foundProduct = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct?.price * foundProduct?.quantity);
        setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - foundProduct?.quantity);
        setCartItems(cartItems.filter((item) => item._id !== product._id));
    };
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);

        if (value === "inc") {
            setCartItems((prevCardItems) =>
                prevCardItems.map((item) => {
                    if (item._id === id) return { ...item, quantity: item.quantity + 1 };
                    return item;
                })
            );
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1);
        } else if (value === "dec") {
            if (foundProduct.quantity > 1) {
                setCartItems((prevCardItems) =>
                    prevCardItems.map((item) => {
                        if (item._id === id) return { ...item, quantity: item.quantity - 1 };
                        return item;
                    })
                );
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
            } else {
                onRemove(foundProduct);
            }
        }
    };

    const incQty = () => {
        setQty((qty) => qty + 1);
    };
    const decQty = () => {
        setQty((qty) => {
            if (qty - 1 < 1) return qty;
            return qty - 1;
        });
    };

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantity,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantity,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => {
    return useContext(Context);
};
