import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import './Classroom.css'

const Classroom = () => {
  return (
    <div className="classroom">
      <div className="grid-container">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="card">
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Visualization {index + 1}
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