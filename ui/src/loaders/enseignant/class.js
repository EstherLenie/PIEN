import { defer } from "react-router-dom";
import { sendRequest } from "../../services/utils/request";
import COURS from "../../services/api/cours";

const classes = [
  {
    nom: "Analyse MPC1",
    matiere: "Analyse",
    niveau: "MPC1",
    nombreCours: 2,
    nombreEleve: 23,
    id: "1",
  },
  {
    nom: "Geometrie MPC1",
    matiere: "Geometrie",
    niveau: "MPC1",
    nombreCours: 2,
    nombreEleve: 23,
    id: "2",
  },
  {
    nom: "Chimie MPC2",
    matiere: "Chimie",
    niveau: "MPC2",
    nombreCours: 2,
    nombreEleve: 23,
    id: "3",
  },
];

export default function ({ params }) {
  const { classeId } = params;

  return defer({
    classe: new Promise((resolve) => {
      setTimeout(() => {
        resolve(classes.find((c) => c.id == classeId));
      }, 1000);
    }),
  });
}
