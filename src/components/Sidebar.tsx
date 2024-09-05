import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const Pages = [
    {
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      page: "Dashboard",
    },
    {
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      page: "Friends",
    },
    {
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
          />
        </svg>
      ),
      page: "Groups",
    },
  ];

  return (
    <aside className="w-[230px] h-full hidden md:block bg-white text-gray-700 pt-4 pl-4 shadow-xl shadow-blue-gray-900/5">
      <nav className="flex flex-col gap-1 w-full font-sans text-base font-normal text-gray-700">
        {Pages.map((item) => (
          <SidebarItem
            key={item.page}
            svg={item.svg}
            page={item.page}
            active={activePage === item.page}
            setActivePage={setActivePage}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

type SidebarItemProps = {
  svg: ReactElement;
  page: string;
  active: boolean;
  setActivePage: (page: string) => void;
};

const SidebarItem = ({
  svg,
  page,
  active,
  setActivePage,
}: SidebarItemProps) => {
  return (
    <Link to={`/${page.toLowerCase()}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setActivePage(page)}
        className={`flex relative items-center w-full p-2 rounded-lg text-start leading-tight hover:bg-green-50 hover:bg-opacity-80 outline-none ${
          active
            ? "text-green-600 after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[5px] after:bg-green-500 after:rounded-l-lg"
            : ""
        }`}
      >
        <div className="mr-4">{svg}</div>
        {page}
      </div>
    </Link>
  );
};
