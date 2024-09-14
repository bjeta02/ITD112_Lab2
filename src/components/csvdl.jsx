import React, { useState } from "react";
import Papa from "papaparse";
import { Button, Input, FormGroup, Form } from "reactstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const CsvUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

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
          // Assuming CSV headers are [ "location", "cases", "deaths", "date", "regions" ]
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
        } catch (error) {
          console.error("Error adding CSV data: ", error);
        }
      },
      header: false, // Set to true if CSV has headers
      skipEmptyLines: true,
    });
  };

  return (
    <div>
      <Form>
        <FormGroup>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </FormGroup>
        <Button color="primary" onClick={handleUpload}>
          Upload CSV
        </Button>
      </Form>
    </div>
  );
};


export default CsvUpload;
