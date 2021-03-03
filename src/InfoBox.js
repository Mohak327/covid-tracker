import React from 'react'
import './InfoBox.css'
// import {casesTypeColors} from './util'
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({title, cases, isRed, isPurple, isGreen, active, total, ...props}) {
  return (
    <Card
        onClick={props.onClick}
        //If active, add the class infoBox--selected
        className={`infoBox
            ${active && 'infoBox--selected'}
            ${isRed && 'infoBox--red'}
            ${isPurple && 'infoBox--purple'}`}
    >
        <CardContent>
            <Typography className='infoBox__title' color='textSecondary'> {title} </Typography>

            <h2 className={`infoBox__cases
                ${(!isRed && !isPurple) && "infoBox__cases--green"}
                ${(!isRed && !isGreen) && "infoBox__cases--purple"}
            `}>{cases}</h2>

            <Typography  className='infoBox__total' color='textSecondary'> {total} Total</Typography>
        </CardContent>
    </Card>
    )
  }

export default InfoBox
