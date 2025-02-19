import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import PassageController from '../controllers/PassageController'
import OverallAccuracyFluencyChart from '../components/barcharts/OverallAccuracyFluencyChart'
import ReadingAssessmentController from '../controllers/ReadingAssessmentController'
import ReadingAssessmentData from '../components/linegraphs/ReadingAssessmentDataLineGraph'
import './Classroom.css'

const Classroom = () => {
  const [passages, setPassages] = useState([])
  const [readingAssessmentData, setReadingAssessmentData] = useState([])

  // Fetch data for Overall Accuracy and Fluency
  useEffect(() => {
    const passageController = new PassageController()
    const data = passageController.getPassageData()
    setPassages(data)
  }, [])

  // Fetch data for Reading Assessment
  useEffect(() => {
    const controller = new ReadingAssessmentController()
    const data = controller.getPassageData()
    setReadingAssessmentData(data)
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
        {/* Card 1: Overall Accuracy and Fluency */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Overall Accuracy and Fluency
            </Typography>
            <OverallAccuracyFluencyChart data={data} />
          </CardContent>
        </Card>

        {/* Card 2: Placeholder for another visualization */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
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
            <Typography gutterBottom variant="h5" component="div">
              Visualization 3
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>

        {/* Card 4: Placeholder for another visualization */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Visualization 4
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>

        {/* Card 1: Overall Accuracy and Fluency */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Reading Assessment Data
            </Typography>
            <ReadingAssessmentData data={readingAssessmentData} />
          </CardContent>
        </Card>

        {/* Card 6: Placeholder for another visualization */}
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Visualization 6
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Data visualization content goes here.
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Long card for additional visualization or data */}
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
