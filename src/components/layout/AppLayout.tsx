import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <Header />
      <main className="ml-0 lg:ml-[260px] pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
