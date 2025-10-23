import {
  Users,
  LucideIcon,
  UserPlus,
  Newspaper,
  BookOpenCheck,
  FileQuestion,
  FileEdit,
  BookText,
  LayoutDashboard,
  Phone,
  Info,
  Home,
  History,
  UserCircle
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getAdminMenuList(): Group[] {
  return [
    {
      groupLabel: "Main",
      menus: [
        {
          href: "/",
          label: "Homepage",
          icon: Home,
        },
        {
          href: "/dashboard/about-us",
          label: "About Us",
          icon: Info,
        },
        {
          href: "/dashboard/contact",
          label: "Contact",
          icon: Phone,
        },
        {
          href: "/dashboard/homepage",
          label: "Homepage Edit",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupLabel: "Courses & Exams",
      menus: [
        {
          href: "",
          label: "Course",
          icon: BookText,
          submenus: [
            {
              href: "/dashboard/course",
              label: "List",
            },
            {
              href: "/dashboard/course/create",
              label: "Create",
            },
          ],
        },
        {
          href: "",
          label: "Exams",
          icon: FileEdit,
          submenus: [
            {
              href: "/dashboard/exams",
              label: "List",
            },
            {
              href: "/dashboard/exams/create",
              label: "Create",
            },
            {
              href: "/dashboard/exams/attempts",
              label: "Attempts",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Content & Users",
      menus: [
        {
          href: "/dashboard/faq",
          label: "FAQ",
          icon: FileQuestion,
        },
        {
          href: "",
          label: "Groups",
          icon: Users,
          submenus: [
            {
              href: "/dashboard/groups",
              label: "List",
            },
            {
              href: "/dashboard/groups/create",
              label: "Create",
            },
          ],
        },
        {
          href: "/dashboard/history",
          label: "History",
          icon: History,
        },
        {
          href: "",
          label: "Lesson",
          icon: BookOpenCheck,
          submenus: [
            {
              href: "/dashboard/lesson",
              label: "List",
            },
            {
              href: "/dashboard/lesson/create",
              label: "Create",
            },
          ],
        },
        {
          href: "",
          label: "News",
          icon: Newspaper,
          submenus: [
            {
              href: "/dashboard/news",
              label: "List",
            },
            {
              href: "/dashboard/news/create",
              label: "Create",
            },
          ],
        },
        {
          href: "",
          label: "Users",
          icon: UserPlus,
          submenus: [
            {
              href: "/dashboard/users",
              label: "List",
            },
            {
              href: "/dashboard/users/generate",
              label: "Generate",
            },
            {
              href: "/dashboard/users/create",
              label: "Create",
            },
            {
              href: "/dashboard/profile",
              label: "Profile",
            },
          ],
        },
      ],
    }
  ];
}

export function getClientMenuList(): Group[] {
  return [
    {
      groupLabel: "Main",
      menus: [
        {
          href: "/",
          label: "Homepage",
          icon: Home,
        },
      ],
    },
    {
      groupLabel: "Learn",
      menus: [
        {
          href: "",
          label: "Learn",
          icon: BookOpenCheck,
          submenus: [
            {
              href: "/learn/exams",
              label: "Exams",
            },
            {
              href: "/learn/lesson",
              label: "Lesson",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Profile",
      menus: [
        {
          href: "/learn/profile",
          label: "Profile",
          icon: UserCircle,
        },
      ],
    },
  ];
}