import { DetailedHTMLProps, createContext, useEffect, useState } from "react";
import { uuidv4 } from "../../util/CommonUtil";
import { gameObjectIndexer, incrementGameObjectIndexer } from "../../store/reducers/GameEnvReducer";
import { useDispatch, useSelector } from "react-redux";

const GameObjectContext = createContext({
  id: "",
  name: "",
  disabled: false,
});

interface GameObjectProps {
  id: string | undefined;
  name: string | undefined;
  disabled: boolean | undefined;
}

const GameObject = (props: GameObjectProps & { children: any }) => {
  const dispatch = useDispatch();
  const [implicitName, setImplicitName] = useState("GameObject-unknown");

  const contextValue: any = {
    id: props.id ?? uuidv4(),
    name: props.name ?? implicitName,
    disabled: props.disabled ?? false,
  };

  useEffect(() => {
    const gameObjectIndex = useSelector(gameObjectIndexer);
    setImplicitName(`GameObject-${gameObjectIndex}`);
    dispatch(incrementGameObjectIndexer());
  }, []);

  return (
    <GameObjectContext.Provider value={contextValue}>
      <group>{contextValue.disabled ? null : props.children}</group>
    </GameObjectContext.Provider>
  );
};

export default GameObject;
