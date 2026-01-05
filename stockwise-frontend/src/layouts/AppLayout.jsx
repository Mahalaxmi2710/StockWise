import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />

      <div className="content">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
