// components/dashboard/data.ts
import { IconDashboard, IconCamera, IconFileDescription, IconReport, IconSettings, IconHelp, IconFolder, IconChartBar,IconReceipt,IconVideo,IconBox,IconCheck,IconLock } from "@tabler/icons-react";
export const ASAM_SIDEBAR = {
  user: { name: "Asam", email: "asam@example.com", avatar: "/avatars/asam.jpg" },
  navMain: [
    { title: "Dashboard", url: "/dashboard/admin", icon: IconDashboard },
    { title: "Manage Videos", url: "/dashboard/admin/videos/manage", icon: IconCamera },
    { title: "Create Kit", url: "/dashboard/admin/kits/create", icon: IconFileDescription },
    { title: "Requests", url: "/dashboard/admin/requests", icon: IconReceipt },
    { title: "Sales", url: "/dashboard/admin/sales", icon: IconReport },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard/admin/settings", icon: IconSettings },
    { title: "Help", url: "/dashboard/admin/help", icon: IconHelp },
  ],
};

export const USER_SIDEBAR = {
  user: {
    name: "Student",
    email: "student@example.com",
    avatar: "/avatars/student.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard/user", icon: IconDashboard },
    { title: "Unpurchased Videos", url: "/dashboard/user/videos/unpurchased", icon: IconLock },
    { title: "My Videos", url: "/dashboard/user/videos/myvideos", icon: IconVideo },
    { title: "Unpurchased Kits", url: "/dashboard/user/kits/unpurchased", icon: IconLock },
    { title: "My Kits", url: "/dashboard/user/kits/mykits", icon: IconBox },

    { title: "Payments", url: "/dashboard/user/payments", icon: IconChartBar },
  ],
  navSecondary: [
    { title: "Help", url: "/dashboard/user/help", icon: IconHelp },
  ],
};