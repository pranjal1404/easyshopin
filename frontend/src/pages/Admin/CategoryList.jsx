import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";


const CategoryList = () => {
  const { data: categories, isLoading, error } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async () => {
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      toast.success(`${updatingName} is updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed. Try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${selectedCategory.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black flex flex-col items-center p-6">
    <AdminMenu />
      <h1 className="text-3xl font-bold text-white mb-8">Manage Categories</h1>
      <form
        onSubmit={handleCreateCategory}
        className="flex flex-col sm:flex-row items-center w-full max-w-2xl mb-8 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="mt-4 sm:mt-0 sm:ml-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Add Category
        </button>
      </form>
      {isLoading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error?.data?.message || error.error}</div>
      ) : (
        <div className="w-full max-w-6xl overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-gray-700">
                  <td className="px-6 py-3">
                    {selectedCategory?._id === category._id ? (
                      <input
                        type="text"
                        value={updatingName}
                        onChange={(e) => setUpdatingName(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      />
                    ) : (
                      <span>{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 flex items-center space-x-4">
                    {selectedCategory?._id === category._id ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setUpdatingName(category.name);
                            setModalVisible(false);
                          }}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setModalVisible(true);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modalVisible && (
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="text-white">
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoryList;
