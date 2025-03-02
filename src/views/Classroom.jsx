import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import OverallAccuracyFluencyChart from '../components/linegraphs/OverallAccuracyFluencyChart';
import './Classroom.css';

const Classroom = ({ student }) => {
  const [overallPerformanceData, setOverallPerformanceData] = useState([]);

  useEffect(() => {
    if (student && student.overallPerformance) {
      const performanceData = [{
        accuracy: student.overallPerformance.accuracy,
        fluency: student.overallPerformance.fluency,
      }];
      setOverallPerformanceData(performanceData);
    }
  }, [student]);

  return (
    <div className="classroom">

      <div className="grid-container">
        {/* Card 1: Overall Accuracy and Fluency */}
        <Card className="card">
          <CardContent>
            {/* <Typography gutterBottom variant="h6" component="div">
              Overall Accuracy and Fluency
            </Typography> */}
            <OverallAccuracyFluencyChart data={overallPerformanceData} />
          </CardContent>
        </Card>

        {/* Card 2: Placeholder for another visualization */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Visualization 2
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>

        {/* Card 3: Placeholder for another visualization */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Visualization 3
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Long card for additional visualization */}
      <Card className="long-card">
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Additional Insights
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Data visualization content goes here.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classroom;
