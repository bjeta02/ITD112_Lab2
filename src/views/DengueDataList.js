import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Papa from "papaparse";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Button,
  Input,
  Row,
  Col,
  FormGroup,
  Form,
  Label
} from "reactstrap";

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
      setFilteredData(dataList); // Initialize filteredData
    };

    fetchData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    const results = dengueData.filter((data) =>
      data.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.regions.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
  }, [searchQuery, dengueData]);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      setFilteredData(filteredData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      const updatedData = dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      );
      setDengueData(updatedData);
      setFilteredData(updatedData); // Update filtered data as well
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    Papa.parse(file, {
      complete: async (results) => {
        try {
          const data = results.data;
          for (let i = 1; i < data.length; i++) { // Skip the header row
            const [location, cases, deaths, date, regions] = data[i];
            await addDoc(collection(db, "dengueData"), {
              location,
              cases: Number(cases),
              deaths: Number(deaths),
              date,
              regions,
            });
          }
          alert("CSV data added successfully!");
          // Refresh data
          const dengueCollection = collection(db, "dengueData");
          const dengueSnapshot = await getDocs(dengueCollection);
          const dataList = dengueSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDengueData(dataList);
          setFilteredData(dataList); // Update filtered data
        } catch (error) {
          console.error("Error adding CSV data: ", error);
        }
      },
      header: false, // Set to true if CSV has headers
      skipEmptyLines: true,
    });
  };

  return (
    <div style={styles.container}>
      <Row>
        <Col md="12">
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle tag="h2" style={styles.cardTitle}>
                Dengue Data List
              </CardTitle>
              <Form style={styles.form}>
                <Row>
                  <Col md="9">
                    <FormGroup>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </FormGroup>
                    <Button color="primary" onClick={handleUpload} style={styles.button}>
                      Upload CSV
                    </Button>
                  </Col>
                  <Col md="3">
                    <FormGroup style={styles.searchGroup}>
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardHeader>
            <CardBody>
              {editingId ? (
                <Form onSubmit={handleUpdate} style={styles.form}>
                  <FormGroup>
                    <Label for="location">Location: </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="cases">Cases: </Label>
                    <Input
                      id="cases"
                      type="number"
                      placeholder="Cases"
                      value={editForm.cases}
                      onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="deaths">Deaths: </Label>
                    <Input
                      id="deaths"
                      type="number"
                      placeholder="Deaths"
                      value={editForm.deaths}
                      onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="date">Date: </Label>
                    <Input
                      id="date"
                      type="date"
                      placeholder="Date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="regions">Regions: </Label>
                    <Input
                      id="regions"
                      type="text"
                      placeholder="Regions"
                      value={editForm.regions}
                      onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
                      required
                      style={styles.input}
                    />
                  </FormGroup>
                  <Button color="success" type="submit" style={styles.button}>
                    Update Data
                  </Button>
                  <Button color="secondary" onClick={() => setEditingId(null)} style={{ ...styles.button, marginLeft: '10px' }}>
                    Cancel
                  </Button>
                </Form>
              ) : (
                <Table responsive style={styles.table}>
                  <thead className="text-primary">
                    <tr>
                      <th style={styles.tableHeader}>Location</th>
                      <th style={styles.tableHeader}>Cases</th>
                      <th style={styles.tableHeader}>Deaths</th>
                      <th style={styles.tableHeader}>Date</th>
                      <th style={styles.tableHeader}>Regions</th>
                      <th style={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((data) => (
                      <tr key={data.id}>
                        <td style={styles.tableCell}>{data.location}</td>
                        <td style={styles.tableCell}>{data.cases}</td>
                        <td style={styles.tableCell}>{data.deaths}</td>
                        <td style={styles.tableCell}>{data.date}</td>
                        <td style={styles.tableCell}>{data.regions}</td>
                        <td style={styles.tableActions}>
                          <Button color="primary" size="sm" onClick={() => handleEdit(data)}>
                            Edit
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleDelete(data.id)} style={{ marginLeft: "10px" }}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  container: {
    marginLeft: '70px', // Adjust to the width of the sidebar
    marginRight: '80px',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#F5F7F8',
  },
  card: {
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  cardTitle: {
    fontSize: '2rem', // Increased font size for card title
    fontWeight: 'bold',
    paddingBottom: '10px', // Padding for spacing below the title
  },
  form: {
    marginBottom: '20px',
    padding: '10px', // Added padding to the form
    backgroundColor: '#f9f9f9', // Light background color for form
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: '10px',
    fontSize: '1.2rem', // Increased font size for input fields
    padding: '10px', // Padding inside input fields
    borderRadius: '20px', // Added border radius
  },
  button: {
    marginTop: '10px',
    fontSize: '1.1rem', // Increased font size for buttons
    padding: '10px 20px', // Padding inside buttons
    borderRadius: '8px', // Added border radius
  },
  table: {
    marginTop: '20px',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  },
  tableHeader: {
    fontSize: '1.2rem', // Increased font size for table headers
    padding: '10px 15px', // Add padding to table headers
    textAlign: 'center', // Center align text
  },
  tableCell: {
    fontSize: '1.1rem', // Increased font size for table cells
    padding: '10px 50px', // Add padding to table cells
    textAlign: 'center', // Center align text
  },
  tableActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center align actions
  },
  searchGroup: {
    textAlign: 'right',
  },
  searchInput: {
    borderRadius: '8px', // Border radius for the search input
    padding: '10px',
  },
};


export default DengueDataList;
