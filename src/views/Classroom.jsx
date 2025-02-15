import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import PassageController from '../controllers/PassageController'
import OverallAccuracyFluencyChart from '../components/barcharts/OverallAccuracyFluencyChart'
import './Classroom.css'

const Classroom = () => {
  const [passages, setPassages] = useState([])

  useEffect(() => {
    const passageController = new PassageController()
    const data = passageController.getPassageData()
    setPassages(data)
  }, [])

  const data = passages.map(passage => ({
    week: passage.week,
    passage1Accuracy: passage.passage1Accuracy,
    passage1Fluency: passage.passage1Fluency,
    passage2Accuracy: passage.passage2Accuracy,
    passage2Fluency: passage.passage2Fluency,
    passage3Accuracy: passage.passage3Accuracy,
    passage3Fluency: passage.passage3Fluency,
  }))

  return (
    <div className="classroom">
      <div className="grid-container">
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Overall Accuracy and Fluency
            </Typography>
            <OverallAccuracyFluencyChart data={data} />
          </CardContent>
        </Card>
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="card">
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Visualization {index + 2}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Data visualization content goes here.
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="long-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Long Visualization
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Data visualization content goes here.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default Classroom