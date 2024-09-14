import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import AddDengueData from './views/AddDengueData';
import DengueDataList from './views/DengueDataList';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={styles.content}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-dengue-data" element={<AddDengueData />} />
            <Route path="/dengue-data-list" element={<DengueDataList />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Inline styles
const styles = {
  content: {
    marginLeft: '360px', // Adjust margin to match the sidebar width
    padding: '20px',
    flex: 1,
    overflowX: 'auto', // Ensure horizontal scrolling if content overflows
  },
};

export default App;
