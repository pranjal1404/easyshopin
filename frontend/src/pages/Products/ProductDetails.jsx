import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="ml-[5%] lg:ml-[10%]">
        <Link
          to="/"
          className="text-white font-semibold hover:underline"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap justify-center items-start mt-8 space-x-8">
            <div className="w-full sm:w-[90%] md:w-[45%] lg:w-[40%] xl:w-[35%] mb-8 sm:mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg object-cover"
              />
              <HeartIcon product={product} />
            </div>

            <div className="w-full sm:w-[90%] md:w-[45%] lg:w-[50%] xl:w-[45%] flex flex-col space-y-6">
              <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
              <p className="text-[#B0B0B0]">{product.description}</p>

              <p className="text-4xl font-extrabold text-white">
              ₹{product.price}
              </p>

              <div className="flex flex-wrap justify-between">
                <div className="w-full sm:w-auto">
                  <h1 className="flex items-center text-white mb-4">
                    <FaStore className="mr-2" /> Brand: {product.brand}
                  </h1>
                  <h1 className="flex items-center text-white mb-4">
                    <FaClock className="mr-2" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center text-white mb-4">
                    <FaStar className="mr-2" /> Reviews: {product.numReviews}
                  </h1>
                </div>

                <div className="w-full sm:w-auto">
                  <h1 className="flex items-center text-white mb-4">
                    <FaStar className="mr-2" /> Ratings: {product.rating}
                  </h1>
                  <h1 className="flex items-center text-white mb-4">
                    <FaShoppingCart className="mr-2" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center text-white mb-4">
                    <FaBox className="mr-2" /> In Stock: {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews } Reviews`}
                />
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="p-2 w-[6rem] rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-orange-700 disabled:bg-gray-500"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="container mt-8 flex justify-center">
            <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
