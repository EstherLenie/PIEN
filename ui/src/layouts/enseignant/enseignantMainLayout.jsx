import Nav from "./nav/nav";
import { SideViewer } from "../../components/sideViewer/sideViewer";

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import { createContext, useRef, useState } from "react";
import Icon from "../../components/icon/icon";
import Title from "../../components/title/title";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";

export const titleContext = createContext({ setTitle: () => {} });

export default function EnseignantLayout() {
  return (
    <>
      <aside>
        <Sidebar />
      </aside>

      <div className="flex flex-col h-full flex-1 overflow-hidden ">
        <header className="flex sticky top-0 bg-white z-30 shadow items-center pl-5">
          <BreadCrumb className="flex-1" />
          <Nav />
        </header>

        <main className="w-full flex flex-col px-5 flex-1 bg-gray-100 overflow-scroll py-4">
          <Outlet />
        </main>

        <aside>
          <SideViewer name="notification" title="Dernieres Notifications">
            <p>Liste Notifications</p>
          </SideViewer>
          <SideViewer name="message" title="Derniers Messages">
            <p>Liste Messages</p>
          </SideViewer>
        </aside>
      </div>
    </>
  );
}
