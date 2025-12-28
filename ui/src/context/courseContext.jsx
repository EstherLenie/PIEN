import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { boxArgument, storage } from "../features/class/utils/utils";
import ResourceChoser from "../features/class/components/organizer/resourceChoser";
import { deepCopyJSON, id } from "../utils/utils";
import { useLoaderData, useParams } from "react-router-dom";
import useApi from "../hooks/api";
import COURS from "../services/api/cours";

export const courseBuilderContext = createContext({
  content: [],
  description: { title: "", description: "", objectif: [] },
  load: () => {},
  save: () => {},
  saveBlock: () => {},
  updateBlock: () => {},
  add: () => {},
  addAfter: () => {},
  duplicate: () => {},
  deleteBox: () => {},
  openChooser: () => {},
  closeChooser: () => {},
  chooserOpened: false,
  newOrder: 0,
  getData: () => {},
  openDescription: () => {},
  closeDescription: () => {},
  descriptionOpen: false,
  setDescription: () => {},
  undo: () => {},
  redo: () => {},
  clean: () => {},
});

const getInitialComponentData = (componentType) => {
  switch (componentType) {
    case "text":
      return { content: "" };
    case "twoColumns":
      return {
        first: { component: "columnChoser" },
        second: { component: "columnChoser" },
      };
    case "audio":
      return null;
    case "video":
      return null;
    case "document":
      return null;
    case "questionLibre":
      return { content: "" };
    case "vraiFaux":
      return { content: "" };
    case "questionMultiple":
      return { content: "", reponses: [] };
    case "3d":
      return null;
    case "recorder":
      return {};
    case "code":
      return { language: "javascript", content: "" };
    case "venn":
      return { sets: {} };
    case "bullseye":
      return {};
    case "table":
      return newTable();
    case "histogram":
      return { title: "", label: "", elems: "" };
    case "barplot":
      return {
        ...newTable(),
        orientation: "vertical",
        ligne: "ligne",
        entete: "entete",
      };
    case "lineplot":
      return {
        ...newTable(),
        ligne: "ligne",
        entete: "entete",
      };
    case "piechart":
      return {
        ...newTable(),
        ligne: "ligne",
        entete: "entete",
      };
    case "youtube":
      return {
        embedUrl: "",
      };
    case "drive":
      return {
        embedUrl: "",
      };
    default:
      return null;
  }

  return {};
};

function newTable() {
  const [col1Id, col2Id] = [id(), id()];

  return {
    headers: [
      { id: col1Id, value: "Colonne 1" },
      { id: col2Id, value: "Colonne 2" },
    ],
    rows: [
      {
        id: id(),
        cells: [
          { column: col1Id, value: "0", id: id() },
          { column: col2Id, value: "0", id: id() },
        ],
      },
    ],
  };
}

function addBlock(blocks, payload) {
  // Le `payload.id` est l'ID du bloc "new" que nous cherchons à remplacer.
  const newOrderIndex = blocks.findIndex((i) => i.id === payload.id);

  // Si l'ID du payload n'est pas trouvé.
  if (newOrderIndex < 0) {
    console.warn(
      "addBlock: Bloc 'new' à remplacer non trouvé pour l'ID:",
      payload.id
    );
    return blocks;
  }

  const oldBlock = blocks[newOrderIndex];
  //copie des anciens blocs permettant le modification de l'etat de maniere immuable
  const newBlocks = blocks.slice();

  // Détermine les données initiales pour le nouveau type de composant.
  const initialDataForNewComponent = getInitialComponentData(
    payload.contentType.component
  );

  const blockDataToSet =
    payload.contentType.data !== undefined && payload.contentType.data !== null
      ? payload.contentType.data
      : initialDataForNewComponent;

  // Crée le NOUVEL objet bloc avec toutes les propriétés nécessaires.
  //    L'ordre des spreads est important ici !
  const newBlockContent = {
    ...payload.contentType,
    order: oldBlock.order, // Conserve l'ordre de l'ancien bloc 'new'
    data: blockDataToSet,
  };

  //  Remplace l'ancien bloc 'new' par le nouveau bloc dans le tableau copié.
  newBlocks.splice(newOrderIndex, 1, newBlockContent);

  return newBlocks;
}

function addAfter(blocks, payload) {
  const blockIndex = blocks.findIndex((e) => e.id === payload);
  if (blockIndex < 0) {
    return blocks;
  }
  const block = blocks[blockIndex];

  const newBlocks = blocks.slice().map((b) => {
    if (b.order > block.order) {
      return {
        ...b,
        order: b.order + 1,
      };
    }
    return b;
  });
  newBlocks.splice(blockIndex, 0, {
    component: "new",
    order: block.order + 1,
    id: crypto.randomUUID(),
  });

  return newBlocks;
}

function deleteBlock(blocks, payload) {
  const blockIndex = blocks.findIndex((e) => e.id === payload);
  if (blockIndex < 0) return blocks;

  const newBlocks = blocks.slice().map((b) => {
    if (b.order > blocks[blockIndex].order) {
      return {
        ...b,
        order: b.order - 1,
      };
    }
    return b;
  });

  newBlocks.splice(blockIndex, 1);

  if (newBlocks.length === 0)
    newBlocks.push({ component: "new", order: 0, id: crypto.randomUUID() });
  return newBlocks;
}

function saveBlock(blocks, id, data) {
  const blockIndex = blocks.findIndex((e) => e.id === id);
  if (blockIndex < 0) return blocks;
  const newBlocks = blocks.slice();
  const block = { ...blocks[blockIndex] };

  const blockData = block.data ?? {};
  if (data) block.data = Object.assign(blockData, deepCopyJSON(data));
  else block.data = getInitialComponentData(block.component);
  newBlocks.splice(blockIndex, 1, block);
  return newBlocks;
}

function updateBlock(blocks, id, data) {
  const blockIndex = blocks.findIndex((e) => e.id === id);
  if (blockIndex < 0) return blocks;
  const newBlocks = blocks.slice();
  const block = { ...blocks[blockIndex] };

  block.data = deepCopyJSON(data);
  newBlocks.splice(blockIndex, 1, block);
  return newBlocks;
}

function undo(presentState) {
  const { blocks, description, past, future } = presentState;
  const lastState = [...past].pop();
  if (!lastState) {
    return presentState;
  }

  return {
    ...lastState,
    future: [...future, { blocks, description }],
    past: [...past.slice(0, -1)],
  };
}

function redo(presentState) {
  const { blocks, description, past, future } = presentState;
  const nextState = [...future].pop();
  if (!nextState) {
    return presentState;
  }

  return {
    ...nextState,
    past: [...past, { blocks, description }],
    future: [...future.slice(0, -1)],
  };
}

const reducer = (state, action) => {
  let newState;
  let redoOrUndo = false;
  switch (action.type) {
    case "UNDO":
      redoOrUndo = true;
      newState = undo(state);
      break;
    case "REDO":
      redoOrUndo = true;
      newState = redo(state);
      break;
    case "ADD":
      newState = { ...state, blocks: addBlock(state.blocks, action.payload) };
      break;
    case "ADD_AFTER":
      newState = { ...state, blocks: addAfter(state.blocks, action.payload) };
      break;
    case "DELETE":
      newState = {
        ...state,
        blocks: deleteBlock(state.blocks, action.payload),
      };
      break;
    case "LOAD":
      newState = {
        ...state,
        blocks: action.payload,
      };
      break;
    case "SAVE_BLOCK":
      newState = {
        ...state,
        blocks: saveBlock(state.blocks, action.payload.id, action.payload.data),
      };
      break;
    case "UPDATE_BLOCK":
      newState = {
        ...state,
        blocks: updateBlock(
          state.blocks,
          action.payload.id,
          action.payload.data
        ),
      };
      break;
    case "DESCRIPTION":
      newState = {
        ...state,
        description: action.payload,
      };
      break;
    default:
      return state;
  }
  const finalState = redoOrUndo
    ? newState
    : Object.assign(newState, {
        past: [
          ...state.past,
          { description: state.description, blocks: state.blocks },
        ],
        future: [],
      });
  storage.setCourse(finalState);
  return finalState;
};

export default function CourseBulderProvider({
  children,
  lecon: { id, titre, description, objectifs, versionActive },
}) {
  const initialCourse = {
    id,
    description: {
      titre,
      description,
      objectifs: objectifs ? objectifs.join("\n") : "",
    },
    past: [],
    future: [],
    blocks: versionActive?.contenu ?? [
      { component: "new", order: 0, id: crypto.randomUUID() },
    ],
    versionId: versionActive?.id,
  };
  const [course, dispacth] = useReducer(reducer, initialCourse);
  const [chooserOpened, setChoserOpened] = useState(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const { execute } = useApi();
  const { leconId, classeId, moduleId } = useParams();

  const closeChooser = () => {
    setChoserOpened(null);
  };

  const openChooser = (id) => {
    setChoserOpened(id);
  };

  const openDescription = () => {
    setDescriptionOpen(true);
  };

  const closeDescription = () => {
    setDescriptionOpen(false);
  };

  const load = useCallback(() => {}, []);

  const save = useCallback(async () => {
    const {
      description: { description, titre },
      blocks,
      versionId,
    } = course;
    const content = {
      description,
      titre,
      contenu: blocks.filter((b) => b.component != "new"),
      id: versionId,
    };

    const r = await execute(
      COURS.SAVE_CONTENT({
        classeId,
        moduleId,
        leconId,
        data: content,
      })
    );
  }, [course]);

  const deleteBox = useCallback(
    (id) => {
      dispacth({ type: "DELETE", payload: id });
    },
    [dispacth]
  );

  const add = useCallback(
    (component) => {
      const id = crypto.randomUUID();
      const contentType = deepCopyJSON(boxArgument(component, undefined, id));
      dispacth({ type: "ADD", payload: { contentType, id: chooserOpened } });
      closeChooser();
    },
    [dispacth, chooserOpened]
  );

  const addAfter = useCallback(
    (id) => {
      dispacth({ type: "ADD_AFTER", payload: id });
    },
    [dispacth]
  );

  const duplicate = useCallback(
    (after) => {
      const id = crypto.randomUUID();
      const model = course.blocks.find((e) => e.id === after);
      const contentType = deepCopyJSON(boxArgument(model.component, {}, id));
      dispacth({ type: "ADD_AFTER", payload: { contentType, after } });
    },
    [dispacth, course]
  );

  const saveBlock = useCallback(
    (id, data) => {
      dispacth({
        type: "SAVE_BLOCK",
        payload: { id, data: deepCopyJSON(data) },
      });
    },
    [dispacth]
  );

  const updateBlock = useCallback(
    (id, data) => {
      dispacth({
        type: "UPDATE_BLOCK",
        payload: { id, data: deepCopyJSON(data) },
      });
    },
    [dispacth]
  );

  const getData = useCallback(
    (id) => {
      const content = course.blocks.find((e) => e.id === id);
      if (content && content.data) return { ...content.data };
    },
    [course]
  );

  const setDescription = (value) => {
    const description = Object.assign(course.description, value);
    dispacth({ type: "DESCRIPTION", payload: description });
  };

  const undo = useCallback(() => {
    dispacth({ type: "UNDO" });
  }, [dispacth]);

  const redo = useCallback(() => {
    dispacth({ type: "REDO" });
  }, [dispacth]);

  const clean = useCallback(() => {
    storage.clean();
  });

  const contextValue = useMemo(
    () => ({
      content: deepCopyJSON(course.blocks),
      description: deepCopyJSON(course.description),
      getData,
      saveBlock,
      updateBlock,
      add,
      addAfter,
      duplicate,
      deleteBox,
      openChooser,
      closeChooser,
      chooserOpened,
      descriptionOpen,
      openDescription,
      closeDescription,
      setDescription,
      load,
      save,
      undo,
      redo,
      clean,
    }),
    [
      getData,
      saveBlock,
      add,
      addAfter,
      duplicate,
      deleteBox,
      openChooser,
      closeChooser,
      chooserOpened,
      saveBlock,
      getData,
      load,
      course,
      descriptionOpen,
      openDescription,
      closeDescription,
      setDescription,
      save,
      undo,
      redo,
      clean,
    ]
  );

  useEffect(() => {
    return clean;
  }, []);

  return (
    <courseBuilderContext.Provider value={contextValue}>
      <ResourceChoser>{children}</ResourceChoser>
    </courseBuilderContext.Provider>
  );
}
