import Login from "../pages/Login";
import Home from "../pages/home";
import EnseignantLayout from "../layouts/enseignant/enseignantMainLayout";
import Dashboard from "../pages/enseignant/dashboard";
import Cours from "../pages/enseignant/editerCours";
import PrivateOnly from "../features/auth/components/privateRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../app";
import EnseignantClasseLayout from "../layouts/enseignant/enseignantClasseLayout";
import EnseignantClasses from "../pages/enseignant/classes";
import EnseignantClasse from "../pages/enseignant/classe";
import EnseignantCours from "../pages/enseignant/lecons";
import ClasseLoader from "../loaders/enseignant/class";

import CreationClasse from "../pages/gestionnaire/creationClasse";
import AssignationEtudiants from "../pages/gestionnaire/assignationEtudiants";
import DashboardGestionnaire from "../pages/gestionnaire/dashboardGestionnaire";
import StudentProfile from "../pages/enseignant/studentProfile";
import MesElevesPanel from "../pages/enseignant/students";
import leconLoader from "../loaders/enseignant/lecon";
import Lecon from "../pages/enseignant/lecon";
import GestionnaireMainLayout from "../layouts/gestionnaire/gestionnaireMainLayout";
import GestionnaireClasseDashboard from "../pages/gestionnaire/gestionnaireClasseDashboard";
import GestionnaireClasseLayout from "../layouts/gestionnaire/gestionnaireClasseLayout";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "enseignant",
        element: (
          <PrivateOnly role="ENSEIGNANT">
            <EnseignantLayout />
          </PrivateOnly>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          { path: "eleves", element: <MesElevesPanel /> },
          {
            path: "eleves/:id",
            element: <StudentProfile />,
          },
          {
            path: "classes",
            element: <EnseignantClasseLayout />,
            children: [
              {
                index: true,
                element: <EnseignantClasses />,
              },
              {
                path: ":classeId",
                children: [
                  {
                    index: true,
                    element: <EnseignantClasse />,
                    loader: ClasseLoader,
                  },
                  {
                    path: "modules",
                    children: [
                      {
                        path: ":moduleId",
                        children: [
                          {
                            index: true,
                            element: <EnseignantCours />,
                          },
                          {
                            path: "lecons/:leconId",
                            element: <Lecon />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "enseignant/classes/:classeId/modules/:moduleId/lecons/:leconId/contenus/:versionId",
        loader: leconLoader,
        element: <Cours />,
      },
      {
        path: "enseignant/classes/:classeId/modules/:moduleId/lecons/new",
        element: <Cours />,
      },
      {
        path: "gestionnaire",
        element: (
          <PrivateOnly role="GESTIONNAIRE">
            <GestionnaireMainLayout />
          </PrivateOnly>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" />,
          },
          {
            path: "dashboard",
            element: <DashboardGestionnaire />, // Écran principal / landing
          },
          {
            path: "classes",
            element: <GestionnaireClasseLayout />,
            children: [
              {
                // path: "dashboard",
                index: true,
                element: <GestionnaireClasseDashboard />, // Formulaire création de classe
              },
              {
                path: "create-classe",
                element: <CreationClasse />, // Formulaire création de classe
              },
              {
                path: ":assigner-etudiant",
                element: <AssignationEtudiants />, // Assignation d'étudiants
              },
            ],
          },
        ],
      },
    ],
  },
]);
