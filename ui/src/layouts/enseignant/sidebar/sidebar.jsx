import { NavLink } from "react-router-dom";
import {
  SideBar,
  SideBarContent,
  SideBarItem,
  SideBarTrigger,
} from "../../../components/sidebar";
import SidebarHeader from "../../../components/sidebar/sidebarHeader";
import Divider from "../../../components/divider/divider";
import SideBarFooter from "../../../components/sidebar/sidebarFooter";

export default function EnseignantSidebar() {
  return (
    <SideBar>
      <SideBarTrigger>
        <SidebarHeader logo={<img alt="logo" src="/logo.png" width="40" />}>
          <p>PIEN</p>
        </SidebarHeader>
      </SideBarTrigger>
      <SideBarContent>
        <Divider />
        <SideBarItem icon="home">
          <NavLink to="dashboard" className="p-2">
            Dashboard
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="book">
          <NavLink to="classes" className="p-2">
            Classe
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="eleve">
          <NavLink to="eleves" className="p-2">
            Eleve
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="evaluation">
          <NavLink to="classes" className="p-2">
            Evaluation
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="correction">
          <NavLink to="classes" className="p-2">
            Correction
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="line">
          <NavLink to="classes" className="p-2">
            Progression
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="calendrier">
          <NavLink to="classes" className="p-2">
            Calendrier
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="envelope">
          <NavLink to="classes" className="p-2">
            Messagerie
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="file">
          <NavLink to="classes" className="p-2 text-inherit">
            Ressource
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="speaker">
          <NavLink to="classes" className="p-2">
            Annonces
          </NavLink>
        </SideBarItem>
        <Divider className="mt-2" />

        <SideBarItem icon="profil">
          <NavLink to="classes" className="p-2">
            Profile
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="preferences">
          <NavLink to="classes" className="p-2">
            Preference
          </NavLink>
        </SideBarItem>
        <SideBarItem icon="support">
          <NavLink to="classes" className="p-2">
            Support
          </NavLink>
        </SideBarItem>
      </SideBarContent>
      <SideBarFooter />
    </SideBar>
  );
}
