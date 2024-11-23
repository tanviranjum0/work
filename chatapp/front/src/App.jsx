import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./components/Views";
import USerContext from "./AccountContext";
const App = () => {
  return (
    <USerContext>
      <Views />
      <ToggleColorMode />
    </USerContext>
  );
};

export default App;
