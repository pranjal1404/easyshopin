import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersapiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-black flex items-center justify-center">
      <section className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
          Update Profile
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring focus:ring-orange-500 transition"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring focus:ring-orange-500 transition"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring focus:ring-orange-500 transition"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring focus:ring-orange-500 transition"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loadingUpdateProfile}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 active:bg-orange-700 transition font-medium"
            >
              {loadingUpdateProfile ? "Updating..." : "Update Profile"}
            </button>

                {/* <Link
                to="/user-orders"
                className="w-full block text-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium"
                >
                My Orders
                </Link> */}
          </div>

          {loadingUpdateProfile && <Loader />}
        </form>
      </section>
    </div>
  );
};

export default Profile;
