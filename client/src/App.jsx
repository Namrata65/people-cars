import { Routes, Route } from "react-router-dom";
import PersonList from "./components/PersonList.jsx";
import PersonDetails from "./pages/PersonDetails.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PersonList />} />
      <Route path="/people/:id" element={<PersonDetails />} />
    </Routes>
  );
};

export default App;
