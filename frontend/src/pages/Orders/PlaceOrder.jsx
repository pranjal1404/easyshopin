import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto p-6 max-w-5xl">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-collapse">
                <thead className="border-b-2 border-gray-700 text-gray-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-4">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">₹{item.price.toFixed(2)}</td>
                      <td className="p-4">₹{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="bg-gray-800 p-6 mt-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-4 text-lg">
                <li>
                  <strong>Items:</strong> ₹{cart.itemsPrice}
                </li>
                <li>
                  <strong>Shipping:</strong> ₹{cart.shippingPrice}
                </li>
                <li>
                  <strong>Tax:</strong> ₹{cart.taxPrice}
                </li>
                <li className="font-bold text-xl">
                  <strong>Total:</strong> ₹{cart.totalPrice}
                </li>
              </ul>
              {error && <Message variant="danger">{error.data.message}</Message>}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-4">Payment Method</h3>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 w-full mt-6"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
