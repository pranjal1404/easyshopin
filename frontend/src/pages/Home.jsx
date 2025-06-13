import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      <title>EasyShopIn - Home</title>
      <meta name="description" content="Discover the best deals on EasyShopIn's homepage!" />

      {/* {!keyword ? <Header /> : null} */}

      <div className="hero bg-cover bg-center h-[20rem] flex items-center justify-center text-white text-center bg-gradient-to-br from-gray-900 via-gray-700 to-black">
  <div className="text-center">
    <h1 className="text-[4rem] font-bold mb-4">Welcome to EasyShopIn!</h1>
  </div>
  <div className="absolute right-10">
    <Link
      to="/productlist"
      className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 px-8"
    >
      Sell
    </Link>
  </div>
</div>


      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
         

          <div className="products mt-10 px-4">
            <h2 className="text-3xl text-white font-bold text-center mb-8">Featured Products</h2>
            <div className="flex justify-center flex-wrap gap-8">
              {data.products.map((product) => (
                <div key={product._id} className="flex flex-col items-center">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
