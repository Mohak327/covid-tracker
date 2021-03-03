import React from 'react'
import numeral from 'numeral'
import {Circle, Popup} from 'react-leaflet'

export const casesTypeColors = {
  cases: {
    hex: "rgba(204, 16, 52, 0.7)",
    border: 'rgba(204, 16, 52, 1)',
    multiplier: 450
  },
  recovered: {
    hex: "rgba(125, 215, 29, 0.7)",
    border: 'rgba(125, 215, 29, 1)',
    multiplier: 300
  },
  deaths: {
    hex: "rgba(102, 51, 153, 0.7)",
    border: 'rgba(102, 51, 153, 1)',
    multiplier: 2000
  }
}


export const sortData = (data) => {
    const sortedData = [...data]

    // Sort in ascending order
    return sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1))

    // Sort in ascending order
    // return sortedData.sort((a,b) => (a.cases > b.cases ? 1 : -1))
}

//Draw circles on map with respective tooltips
export const showDataOnMap = (data, casesType='cases') =>
    data.map((country) => (
            <Circle
                center={[country.countryInfo.lat, country.countryInfo.long]}
                pathOptions={{
                    color: casesTypeColors[casesType].hex,
                    fillColor: casesTypeColors[casesType].hex
                }}
                fillOpacity={0.5}
                radius={
                    Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
                }
            >
            <Popup>
              <div className='info-container'>
                <div className='info-flag' style={{ backgroundImage: `url(${country.countryInfo.flag})` }}/>
                <div className='info-name'>{country.country}</div>
                <div className='info-confirmed'>Cases: {numeral(country.cases).format('0,0')}</div>
                <div className='info-recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                <div className='info-deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>
              </div>
            </Popup>

        </Circle>
    ))

export const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0"

export const prettyPrintTotals = (stat) =>
    stat ? `${numeral(stat).format("0.0a")}` : "0"