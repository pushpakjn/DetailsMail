import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from "./components/Form";
import Table from "./components/Table";
import UpdateForm from './components/UpdateForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/form" element={<Form />} />
          <Route path="/update" element={<UpdateForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
