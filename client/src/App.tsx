import { Routes, Route } from "react-router-dom";
import UusiKeskustelu from "./components/UusiKeskustelu";
import Keskustelut from "./components/Keskustelut";
import YksiKeskustelu from "./components/YksiKeskustelu";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Keskustelut />} />
      <Route path="/uusikeskustelu" element={<UusiKeskustelu />} />
      <Route path="/keskustelut/:id" element={<YksiKeskustelu />} />
    </Routes>
  );
}

export default App;
