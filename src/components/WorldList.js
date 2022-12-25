import { useEffect, useState } from 'react';
import axios from 'axios';
import Country from './Country';
import React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

function WorldList(){
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState("");
    const [possibleCountries,setPossibleCountries]=useState([])

    const getPossibleCountries=()=>{
        fetch('http://localhost:3004/countries',{
            header:{
                'Content-Type':'application/json',
                'Accept':'application/json'  
            }
        })
        .then((response)=>response.clone().json())
        .then((myJson)=>{
            setPossibleCountries(myJson)
        })
    }

    const loadCountriesFromAPI = () => {
        axios.get('http://localhost:8080/api/countries')
            .then((response) => {
                if (response.status === 200) {
                    setCountries(response.data);
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    const [currCountry,setCurrCountry]=useState(0)
    var countryId=0
    const getCurrCountry=(name)=>{
        countries.forEach((item)=>{
            if(name==item.name){
                countryId=item.id
                setCurrCountry(countryId)
            }
        })
    }

    useEffect(() => {
        loadCountriesFromAPI();
        getPossibleCountries()
    }, [])

    const addCountry = (item) => {
        axios.post('http://localhost:8080/api/countries', {
            "name": item.name,
            "population": item.population,
            "selected":false
        })
            .then((response) => {
                if (response.status === 201) {
                    loadCountriesFromAPI();
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    const [citizens, setCitizens] = useState([]);

    const addCitizen = (item) => {
        getCurrCountry(item.country)
        console.log(item)
        axios.post('http://localhost:8080/api/countries/'+countryId+'/citizens', {
            "name": item.name,
            "selected": false,
            "job":{
                "name":item.job.name,
                "salary":item.job.salary,
                "weeklyHours":item.job.weeklyHours
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    axios.get('http://localhost:8080/api/countries/'+countryId+'/citizens')
                        .then((response) => {
                            if (response.status === 200) {
                                setCitizens(response.data);
                            }
                        })
                        .catch((error) => {
                            setError(error.status + " error")
                        })  
                    loadCountriesFromAPI(); 
                    /*setUpdate(<div>{countries.map((item)=>{
                        return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
                    })}</div>)*/
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })

          
    }

    /*const setCountry = (id, country) => {
        console.log(id)
        console.log(countries)
        axios.patch(('http://localhost:8080/api/citizens' + id), {
            "country": country,
        })
            .then((response) => {
                if (response.status === 200) {
                    loadCountriesFromAPI()
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }*/

    const selectCountry = (item) => {
        axios.put(('http://localhost:8080/api/countries/' + item.id), {
            "name": item.name,
            "population":item.population,
            "selected": !item.selected,
        })
            .then((response) => {
                if (response.status === 200) {
                    loadCountriesFromAPI()
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    const deleteCountry = (id) => {
        axios.delete('http://localhost:8080/api/countries/' + id)
            .then((response) => {
                if (response.status === 200)
                    loadCountriesFromAPI()
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    const handleCountrySubmit = (event) => {
        event.preventDefault();
        const name = event.target.elements.countryName.value
        const population = event.target.elements.population.value

        if (name.length < 4||name.length > 56) {
            setError("Shortest country name is 4 characters and longest country name is 56 characters or country name needs to be valid")
            setCountries([])
            return;
        }
        if (population<800||population>1439323776) {
            setError("Smallest population is 800 and largest population is 1,439,323,776")
            setCountries([])
            return;
        }
        setError("")
        
        addCountry({
            "name": name,
            "population": population,
        })
        event.target.elements.countryName.value = ""
        event.target.elements.population.value = ""

    }

    const handleCitizenSubmit = (event) => {
        event.preventDefault();
        const citizenName = event.target.elements.citizenName.value
        const country = event.target.elements.country.value
        const job = event.target.elements.job.value
        const salary = event.target.elements.salary.value
        const weeklyHours = event.target.elements.weeklyHours.value

        var isExist=false;
        possibleCountries.forEach((item)=>{
            if(item.name==country){
                isExist=true
            }
        })
        if(!isExist){
            setError("Country hasn't been added");
            setCountries([])
            return;
        }

        if(job.length<3||job.length>40){
            setError("Job name needs to be between 3 and 40 characters and needs to be vslid");
            setCountries([])
        }

        if(salary<3||salary>1000000){
            setError("Job name needs to be between 3 and 40 characters and needs to be vslid");
            setCountries([])
        }

        if (weeklyHours <0 || weeklyHours > 100) {
            setError("Weekly hours needs to be a valid number")
            setCountries([])
            return;
        }
        setError("")
        
        addCitizen({
            "name": citizenName,
            "job": {
                "name":job,
                "salary":salary,
                "weeklyHours":weeklyHours
            },
            "country":country
        })
        event.target.elements.citizenName.value = ""
        event.target.elements.country.value = ""
        event.target.elements.job.value = ""
        event.target.elements.salary.value = ""
        event.target.elements.weeklyHours.value = ""
    } 
    
    /*const [update,setUpdate]=useState(<div>{countries.map((item)=>{
        return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
    })}</div>)*/
    
    const handleClick = geo => () => {
        var countryName=document.getElementsByName("countryName")[0];
        var country=document.getElementsByName("country")[0]
        console.log(geo);
        country.value=geo.name
        countryName.value=geo.name

        var population=document.getElementsByName("population")[0]
        const populationExist=false;
        possibleCountries.forEach((item)=>{
            if(item.ISO3.substr(0,2)==geo["Alpha-2"]){
                console.log(geo)
                console.log(item)
                population.value=item.population_density
                populationExist=true
            }
        })
        if(!populationExist){
            population.value=0
        }
    }

    return(
        <div>
            <div>
                <ComposableMap width={1000}>
                    <Geographies geography={"https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                            return <Geography key={geo.rsmKey} geography={geo} 
                            stroke="#000000"
                            tabIndex={-1}
                            style={{
                                default: { outline: "none" },
                                hover: { fill: "#255B52", transition: "0.3s" },
                                pressed: { outline: "none" },
                            }}
                            onClick={handleClick(geo.properties)}/>
                            })
                        }
                    </Geographies>
                </ComposableMap>
            </div>
            <div>{error}</div>
            <div>{countries.map((item)=>{
                return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
            })}</div>
            
            <h1>Add or Modify Countries</h1>
            <form onSubmit={handleCountrySubmit}>
                <label>Name</label>
                <input name="countryName"></input>
                <label>Population</label>
                <input name="population"></input>
                <button type="submit">Add</button>
            </form>
            <h1>Add or Modify Citizens</h1>
            <form onSubmit={handleCitizenSubmit}>
                <label>Name</label>
                <input name="citizenName"></input>
                <label>Country</label>
                <input name="country"></input>
                <label>Job</label>
                <input name="job"></input>
                <label>Salary</label>
                <input name="salary"></input>
                <label>Weekly Hours</label>
                <input name="weeklyHours"></input>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default WorldList;