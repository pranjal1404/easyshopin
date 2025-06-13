import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto p-6 max-w-6xl">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
              <div className="border-t border-gray-700 mt-5">
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
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
                        {order.orderItems.map((item, index) => (
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
                )}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
              <p className="mb-4">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="mb-4">
                <strong>Customer:</strong> {order.user.username}
              </p>
              <p className="mb-4">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="mb-4">
                <strong>Shipping Address:</strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p className="mb-4">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between mb-2 font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>
              {!order.isPaid && (
                <div className="mt-6">
                  {loadingPay ? (
                    <Loader />
                  ) : isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <button
                    className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 w-full mt-6"
                    onClick={deliverHandler}
                  >
                    Mark as Delivered
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
