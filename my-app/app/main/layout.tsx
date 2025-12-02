import Sidebar from "./Sidebar";

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-theme">
      <Sidebar />
      <main className="flex p-3">{children}</main>
      {/* <main className="flex p-3 bg-stone-400">{children}</main> */}
    </div>
  );
}
