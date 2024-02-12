import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Logo from "@/app/ui/logo";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 dark:bg-black ">
      {/* Link for logoen, som sender deg til dashboard hjemmesiden når den blir klikket */}
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          {/* Logoen */}
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Viser tre bokser med linker til forskjellige sider som er angitt i "nav-links.tsx" */}
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-blue-600 md:block">
          <p>Sign out</p>
        </div>
      </div>
    </div>
  );
}
