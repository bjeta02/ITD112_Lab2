import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Form,
  Input,
  Button,
  Row,
  Col,
  Label,
} from "reactstrap";

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Row className="justify-content-center mt-5" style={styles.row}>
      <Col md="8" lg="6">
        <Card style={styles.card}>
          <CardHeader style={styles.cardHeader}>
            <h3 className="text-center">Add Dengue Data</h3>
          </CardHeader>
          <CardBody style={styles.cardBody}>
            <Form onSubmit={handleSubmit}>
              <FormGroup style={styles.formGroup}>
                <Label for="location">Location: </Label>
                <Input
                  type="text"
                  id="location"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={styles.input}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <Label for="cases">Cases: </Label>
                <Input
                  type="number"
                  id="cases"
                  placeholder="Enter number of cases"
                  value={cases}
                  onChange={(e) => setCases(e.target.value)}
                  required
                  style={styles.input}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <Label for="deaths">Deaths: </Label>
                <Input
                  type="number"
                  id="deaths"
                  placeholder="Enter number of deaths"
                  value={deaths}
                  onChange={(e) => setDeaths(e.target.value)}
                  required
                  style={styles.input}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <Label for="date">Date: </Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={styles.input}
                />
              </FormGroup>
              <FormGroup style={styles.formGroup}>
                <Label for="regions">Region: </Label>
                <Input
                  type="text"
                  id="regions"
                  placeholder="Enter region"
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  required
                  style={styles.input}
                />
              </FormGroup>
              <Button color="primary" block type="submit" style={styles.button}>
                Add Data
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

// Inline styles
const styles = {
  row: {
    width: '90%',
    padding: '0 20px',
  },
  card: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#F5F7F8',
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
    padding: '10px 20px',
  },
  cardBody: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    fontSize: '16px',
    padding: '10px',
    borderRadius: '30px',
    border: '1px solid #ced4da',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  },
  inputFocus: {
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.25)',
  },
  button: {
    fontSize: '16px',
    padding: '10px',
    borderRadius: '4px',
  },
};

export default AddDengueData;
