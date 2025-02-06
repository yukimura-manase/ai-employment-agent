import { Home, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shared/ui-elements/sidebar";
import { RiRobot2Line } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { IoMdPaper } from "react-icons/io";

// Sidebar Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "AI就活エージェントとの会話",
    url: "/talk-room",
    icon: RiRobot2Line,
  },
  {
    title: "就活プロフィール",
    url: "/user-work-profile",
    icon: ImProfile,
  },
  {
    title: "エントリーシート作成",
    url: "/entry-sheet",
    icon: IoMdPaper,
  },
  {
    title: "求人検索",
    url: "/job-search",
    icon: Search,
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="h-[80px]"></div>
        <SidebarGroup>
          <SidebarGroupLabel>アプリ・メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
