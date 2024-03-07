import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from "./components/Form";
import Table from "./components/Table";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
