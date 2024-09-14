import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    lineChartData: null,
    barChartData: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, 'dengueData');
        const dengueSnapshot = await getDocs(dengueCollection);
        const dataList = dengueSnapshot.docs.map((doc) => doc.data());

        const casesByRegion = dataList.reduce((acc, item) => {
          const region = item.regions;
          if (!acc[region]) {
            acc[region] = { cases: 0, deaths: 0 };
          }
          acc[region].cases += item.cases;
          acc[region].deaths += item.deaths;
          return acc;
        }, {});

        const regions = Object.keys(casesByRegion);
        const cases = regions.map(region => casesByRegion[region].cases);
        const deaths = regions.map(region => casesByRegion[region].deaths);

        setChartData({
          lineChartData: {
            labels: regions,
            datasets: [
              {
                label: 'Dengue Cases by Region',
                data: cases,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
              }
            ]
          },
          barChartData: {
            labels: regions,
            datasets: [
              {
                label: 'Cases',
                data: cases,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
              {
                label: 'Deaths',
                data: deaths,
                backgroundColor: 'rgba(255,99,132,0.6)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
              }
            ]
          }
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {chartData.lineChartData && (
        <div style={{ width: '60%', margin: 'auto' }}>
          <h3>Dengue Cases by Region</h3>
          <Line data={chartData.lineChartData} options={{ responsive: true }} />
        </div>
      )}
      {chartData.barChartData && (
        <div style={{ width: '60%', margin: 'auto', marginTop: '40px' }}>
          <h3>Cases vs Deaths by Region</h3>
          <Bar data={chartData.barChartData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
