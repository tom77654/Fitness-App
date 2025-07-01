import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../../styles/Apex.css';




const ProgressBar = ({value}) => {
  console.log('ProgressBar Wert:', value);
  const safeValue = Number(value) || 0;
  
  
    const options= {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      colors: ['lightseagreen'],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '50%',
          },
          dataLabels:{
            value:{
              formatter: function (val){
                return `${Math.round(val)}%`;
              },
              fontSize: "22px",
              color: "lightseagreen",
            }
          }
        },
      },
      labels: ['Fortschritt'],
    
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={[safeValue]}
        type="radialBar"
        height={350}
        
      />
    </div>
  );
};


export default ProgressBar;
