import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-80 h-[24rem] p-4 bg-gray-800 rounded-lg shadow-lg relative mx-auto mb-8 transition-transform transform hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg"
        />
        <HeartIcon product={product} />
      </div>

      <div className="mt-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <span className="text-lg font-bold text-white">{product.name}</span>
            <span className="bg-pink-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-orange-900 dark:text-orange-300">
            ₹{product.price}
            </span>
          </h2>
        </Link>
        <p className="text-sm text-gray-400 mt-2">
          {product.description?.substring(0, 50)}...
        </p>
      </div>
    </div>
  );
};

export default Product;
