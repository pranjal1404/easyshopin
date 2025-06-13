import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black text-white p-6 flex items-center justify-center">
      <div className="container max-w-7xl">
        <h1 className="text-lg font-bold text-center mt-8">FAVORITE PRODUCTS</h1>

        <div className="flex flex-wrap justify-center mt-8">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
