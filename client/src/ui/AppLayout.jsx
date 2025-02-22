import { Outlet } from "react-router";

function AppLayout() {
  return (
    <>
      <div className="flex h-screen">
        {" "}
        <div className="flex-1 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
