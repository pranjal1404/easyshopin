import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Redirect if no address exists
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black text-white p-6 flex items-center justify-center">
      <div className="container max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
        <ProgressSteps step1 step2 />
        <form onSubmit={submitHandler} className="mt-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Shipping</h1>
          <div className="mb-4">
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-pink-500 focus:outline-none"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-pink-500 focus:outline-none"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-pink-500 focus:outline-none"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-pink-500 focus:outline-none"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400">Select Payment Method</label>
            <div className="mt-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-pink-500 focus:ring-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-white">PayPal or Credit Card</span>
              </label>
            </div>
          </div>
          <button
            className="bg-orange-500 text-white py-3 px-6 rounded-full text-lg w-full hover:bg-orange-600 focus:outline-none focus:ring focus:ring-pink-300"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
