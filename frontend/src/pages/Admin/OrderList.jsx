import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto p-6 max-w-6xl">
        <AdminMenu />
        <h2 className="text-2xl font-bold mb-6 text-center">Order List</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-800 mx-auto">
            <table className="table-auto w-full text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="p-4">ITEMS</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">USER</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">PAID</th>
                  <th className="p-4">DELIVERED</th>
                  <th className="p-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-gray-600 transition duration-150"
                  >
                    <td className="p-4">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td className="p-4">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>
                    <td className="p-4">₹{order.totalPrice}</td>
                    <td className="p-4">
                      <span
                        className={`p-2 rounded-full text-center text-sm ${
                          order.isPaid ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isPaid ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`p-2 rounded-full text-center text-sm ${
                          order.isDelivered ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isDelivered ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
