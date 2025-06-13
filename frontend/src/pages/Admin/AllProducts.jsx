import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading products</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-7xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          All Products ({products.length})
        </h1>

        {/* Centered Products Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow w-[18rem]"
            >
              <Link to={`/admin/product/update/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <span className="text-sm text-gray-400">
                    {moment(product.createdAt).format("MMM Do, YYYY")}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  {product.description?.substring(0, 100)}...
                </p>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring focus:ring-pink-300"
                  >
                    Update Product
                    <svg
                      className="inline w-4 h-4 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </Link>
                  <span className="text-lg font-bold">₹ {product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
