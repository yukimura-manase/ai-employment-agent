import { ReactNode } from "react";
import { Header } from "@/components/shared/ui-parts/header";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";

/**
 * Basic Layout
 *
 * - Header
 * - Main Area
 */
export const SideBarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SidebarProvider>
        <AppSidebar />

        <main className="flex gap-2">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};
