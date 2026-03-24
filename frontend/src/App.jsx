import { useState } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";

function App() {
  const [showMenu, setShowMenu] = useState(false);

  return showMenu ? (
    <Menu onClose={() => setShowMenu(false)} />
  ) : (
    <Home onOpenMenu={() => setShowMenu(true)} />
  );
}

export default App;