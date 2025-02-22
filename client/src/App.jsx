import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";

import AppLayout from "./ui/AppLayout";
import Admindashboard from "./features/admin/Admindashboard";
import CreateTask from "./features/tasks/CreateTask";
import ShowTask from "./features/tasks/ShowTask";
import EditTask from "./features/tasks/EditTask";
import CreateUser from "./features/users/CreateUser";
import Login from "./features/auth/Login";
import UserDashboard from "./features/users/UserDashboard";
import ShowUser from "./features/users/ShowUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userdashboard/:userId" element={<UserDashboard />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/admin" element={<Admindashboard />}>
          <Route index element={<CreateTask />} />
          <Route path="add-task" element={<CreateTask />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="show-task" element={<ShowTask />} />
          <Route path="show-users" element={<ShowUser />} />
          <Route path="edit/:id" element={<EditTask />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
