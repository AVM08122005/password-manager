import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCopy,
  faTrash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Manager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ website: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch passwords from server
  const getPasswords = async () => {
    try {
      const response = await fetch("http://localhost:3000");
      if (!response.ok) {
        throw new Error("Failed to fetch passwords");
      }
      const passwords = await response.json();
      setPasswordArray(passwords);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast.error("Failed to load passwords");
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.website.length < 4 ||
      form.username.length < 4 ||
      form.password.length < 4
    ) {
      toast.error("All fields must be at least 4 characters");
      return;
    }

    try {
      if (editMode && editId) {
        // Update existing password
        const response = await fetch(`http://localhost:3000/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to update password");
        }

        toast.success("Password updated successfully!");
      } else {
        // Create new password
        const response = await fetch("http://localhost:3000", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to save password");
        }

        const result = await response.json();

        // Add new password to UI
        setPasswordArray([...passwordArray, result.password]);
        toast.success("Password saved successfully!");
      }

      // Reset form and edit state
      setForm({ website: "", username: "", password: "" });
      setEditMode(false);
      setEditId(null);

      // Refresh the password list
      getPasswords();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  // Delete password
  const deletePassword = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this password?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete password");
      }

      // Remove from UI
      setPasswordArray(passwordArray.filter((item) => item._id !== id));
      toast.success("Password deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete password");
    }
  };

  // Edit password
  const editPassword = (password) => {
    setForm({
      website: password.website,
      username: password.username,
      password: password.password,
    });
    setEditMode(true);
    setEditId(password._id);
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  // Toggle password visibility
  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="min-h-[82vh]">
        <div className="container mx-auto bg-green-300 max-w-4xl rounded-2xl shadow-lg mt-10">
          <div className="text-center text-2xl font-bold p-2">
            <span className="m-1.5">
              <FontAwesomeIcon icon={faKey} className="text-2xl" />
            </span>
            <h1 className="font-normal text-2xl">
              {editMode ? "Edit Password" : "Add New Password"}
            </h1>
          </div>

          <div className="text-black flex-col p-4 gap-3 justify-center items-center align-middle px-10">
            <form onSubmit={handleSubmit}>
              <input
                className="border border-black rounded-2xl p-2 my-2 w-full bg-amber-50"
                type="text"
                name="website"
                placeholder="Enter Website URL"
                value={form.website}
                onChange={handleChange}
                required
                minLength={4}
              />

              <div className="flex gap-2 md:flex-row flex-col justify-center items-center">
                <input
                  className="border border-black rounded-2xl p-2 my-2 w-full bg-amber-50"
                  type="text"
                  placeholder="Enter Username"
                  value={form.username}
                  onChange={handleChange}
                  name="username"
                  required
                  minLength={4}
                />

                <div className="relative w-full">
                  <input
                    className="border border-black rounded-2xl p-2 my-2 w-full bg-amber-50 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    required
                    minLength={4}
                  />
                  <FontAwesomeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? faEye : faEyeSlash}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer text-black text-lg"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center my-2">
                <button
                  type="submit"
                  className="cursor-pointer flex justify-center items-center gap-2 bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 group border-green-500 border-1"
                >
                  {/* Lord Icon - Only shown for Save Password */}
                  {!editMode && (
                    <lord-icon
                      src="https://cdn.lordicon.com/efxgwrkc.json"
                      trigger="hover"
                      style={{ width: "24px", height: "24px" }}
                    ></lord-icon>
                  )}

                  {/* Text */}
                  {editMode ? "Update Password" : "Save"}
                </button>

                {editMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ website: "", username: "", password: "" });
                      setEditMode(false);
                      setEditId(null);
                    }}
                    className="ml-3 cursor-pointer flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="tables my-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold align-middle mb-4">
            Your Saved Passwords
          </h2>

          {passwordArray.length === 0 ? (
            <div className="text-gray-500 text-lg">No passwords saved yet</div>
          ) : (
            <table className="table-auto w-5/6 rounded-md overflow-hidden shadow-lg">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Website</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => (
                  <tr key={item._id}>
                    <td className="text-center w-2 py-2 border border-white">
                      <a
                        href={
                          item.website.startsWith("http")
                            ? item.website
                            : `https://${item.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.website}
                      </a>
                      <FontAwesomeIcon
                        icon={faCopy}
                        className="ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(item.website)}
                      />
                    </td>
                    <td className="text-center w-2 py-2 border border-white">
                      {item.username}
                      <FontAwesomeIcon
                        icon={faCopy}
                        className="ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(item.username)}
                      />
                    </td>
                    <td className="text-center w-2 py-2 border border-white">
                      {visiblePasswords[index]
                        ? item.password
                        : "•".repeat(item.password.length)}
                      <FontAwesomeIcon
                        icon={visiblePasswords[index] ? faEyeSlash : faEye}
                        className="ml-2 cursor-pointer text-black"
                        onClick={() => togglePasswordVisibility(index)}
                      />
                      <FontAwesomeIcon
                        icon={faCopy}
                        className="ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(item.password)}
                      />
                    </td>
                    <td className="text-center w-2 py-2 border border-white">
                      <span className="flex justify-center items-center">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="ml-4 cursor-pointer"
                          onClick={() => deletePassword(item._id)}
                        />
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="ml-4 cursor-pointer"
                          onClick={() => editPassword(item)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
