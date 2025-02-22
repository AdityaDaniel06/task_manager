import { useState } from "react";
import axios from "axios";
import { message } from "antd";
function CreateUser() {
  const [input, setInput] = useState({});

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
    console.log(input);
  };

  const createUser = () => {
    let api = "http://127.0.0.1:8000/api/v1/users/createUser";
    axios
      .post(api, input)
      .then((res) => {
        console.log(res);
        message.success("New User Created Successfully");
        if (res.status == 201) {
          setInput({
            name: "",
            email: "",
            password: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Unable to create User", err.data.error);
      });
  };
  return (
    <>
      <div className="w-1/2 mt-20 ml-80">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl text-emerald-700 font-semibold mb-4">
            Create a new user
          </h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
              Enter Username
            </label>
            <input
              type="text"
              placeholder="Harry Potter"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              name="name"
              value={input.name || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Enter Email
            </label>
            <input
              type="email"
              placeholder="example@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              name="email"
              value={input.email || ""}
              onChange={handleInput}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-1"
            >
              Enter Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              name="password"
              value={input.password}
              onChange={handleInput}
            />
          </div>
          <button
            onClick={createUser}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Create User
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
