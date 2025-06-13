import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black text-white p-6 flex items-center justify-center">
      <div className="container w-full md:w-3/4 lg:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p>
              Your cart is empty.{" "}
              <Link to="/shop" className="text-orange-500">
                Go To Shop
              </Link>
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Shopping Cart
            </h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center mb-6 pb-2 border-b border-gray-700"
              >
                <div className="w-[5rem] h-[5rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link to={`/product/${item._id}`} className="text-orange-500">
                    {item.name}
                  </Link>
                  <div className="mt-2">{item.brand}</div>
                  <div className="mt-2 font-bold">₹ {item.price}</div>
                </div>

                <div className="w-24">
                  <select
                    className="w-full p-1 border rounded text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="text-red-500 ml-4"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold mb-2">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>
              <div className="text-2xl font-bold mb-4">
              ₹{" "}
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </div>
              <button
                className="bg-orange-500 py-2 px-4 rounded-full text-lg"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
