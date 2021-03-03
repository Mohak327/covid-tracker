import React, {useState, useEffect} from 'react'
import './App.css'
import {
    MenuItem,
    FormControl,
    Select,
    Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import {sortData, prettyPrintStat, prettyPrintTotals} from  './util'
import numeral from "numeral";
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'

function App () {

    const [countries, setCountries] = useState([])
    const [mapCountries, setMapCountries] = useState([])
    const [country, setCountry] = useState('worldwide')
    const [countryInfo, setCountryInfo] = useState({})
    const [tableData, setTableData] = useState([])
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
    const [mapZoom, setMapZoom] = useState(3)
    const [casesType, setCasesType] = useState('cases')

    //To fetch worldwide data when site loads.
    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
        .then((response) => response.json())
        .then(data =>{
            setCountryInfo(data)
        })
    }, [])

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
            .then((response) => response.json())
            .then((data) => {
                const countries =  data.map((country) => ({
                    name: country.country,
                    value: country.countryInfo.iso2
                }))

                const sortedData = sortData(data)
                setTableData(sortedData)
                setMapCountries(data)
                setCountries(countries)
            })
        }
        getCountriesData()
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value
        // setCountry(countryCode)

        const url = countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            setCountry(countryCode);
            setCountryInfo(data);
            console.log("Country data: ",data);

            if(countryCode === "worldwide"){
            setMapCenter({ lat: 34.80746, lng: -40.4796 });
            setMapZoom(2);
            }
            else{
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
            }
            // countryCode === "worldwide" ? (
            //   setMapCenter({ lat: 34.80746, lng: -40.4796 });
            //   setMapZoom(3);
            // ) : (
            //   setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            //   setMapZoom(4);
            // )
        })
    }

    console.log('Country Info >>>', countryInfo)

    return (
    <div className='app'>
        <div className="app__left">
            <div className="app__header">
                <h1>COVID-19 TRACKER</h1>

                <FormControl className='app__dropdown'>
                    <Select
                    variant='outlined'
                    value={country}
                    onChange={onCountryChange}
                    >
                        <MenuItem value = 'worldwide'>Worldwide</MenuItem>
                        {countries.map((country) => (
                        <MenuItem value = {country.value}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="app__stats">
                <InfoBox
                    isRed
                    // active is true when casesType is cases.
                    active={casesType === "cases"}
                    className="infoBox__cases"
                    onClick={(e) => setCasesType('cases')}
                    title='Coronavirus Cases'
                    cases={prettyPrintStat(countryInfo.todayCases)}
                    total={prettyPrintTotals(countryInfo.cases)}
                />
                <InfoBox
                    isGreen
                    active={casesType === "recovered"}
                    className="infoBox__recovered"
                    onClick={(e) => setCasesType("recovered")}
                    title='Recovered'
                    cases={prettyPrintStat(countryInfo.todayRecovered)}
                    total={prettyPrintTotals(countryInfo.recovered)}
                />
                <InfoBox
                    isPurple
                    active={casesType === "deaths"}
                    className="infoBox__deaths"
                    onClick={(e) => setCasesType("deaths")}
                    title='Deaths'
                    cases={prettyPrintStat(countryInfo.todayDeaths)}
                    total={prettyPrintTotals(countryInfo.deaths)}
                    // total={numeral(countryInfo.deaths).format('0,0')}
                />
            </div>

            <Map
                countries={mapCountries}
                center={mapCenter}
                zoom={mapZoom}
                casesType={casesType}
            />
        </div>

        <Card className="app__right">
            <CardContent>
                <div className="app__information">
                    <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                    <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
                    <LineGraph className='app__graph' casesType={casesType}/>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}

export default App
