import Link from "next/link";
import Image from "next/image";
import { HeaderFullscreen } from "../RequireFullscreen/HeaderFullscreen";
import AppHeaderUser from "../AppHeaderUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className=" sticky top-0 z-50 flex w-full bg-black drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-black p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >

         
          </button>

          <Link className="block flex-shrink-0 " href="/">
            <Image
              width={32}
              height={32}
              src={"/assets/logo.png"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="bg-red-500">
          <HeaderFullscreen />
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <AppHeaderUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
