import { useEffect, useState } from 'react';
import axios from 'axios';
import Country from './Country';
import React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function WorldList(){
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState("");
    const [possibleCountries,setPossibleCountries]=useState([])
    const {register,handleSubmit,reset,formState:{errors:errors2},setValue:setValue2}=useForm()
    const {register:register2,handleSubmit:handleSubmit2,reset:reset2,setValue,formState: { errors }}=useForm({
        criteriaMode: "all"
      })

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
        /*setDisplay(<div>{countries.map((item)=>{
            return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
        })}</div>)*/
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

    const handleCountrySubmit = (data) => {
        console.log(data)
        const name = data.countryName
        const population = data.population

        if(name==""&&population==""&&countryName.value!=""&&population.value!=""){
            name=countryName.value
            population=population.value
        }

        var isAlreadyThere=false;
        countries.forEach((item)=>{
            if(data.countryName==item.name){
                console.log(data.countryName)
                console.log(item.name)
                setError("Country already exists in the list")
                isAlreadyThere=true
            }
        })
        if(isAlreadyThere){
            setError("Country already exists in the list")
            reset()
            return;
        }

        if(!populationExist){
            setError("Country name is not valid")
            setCountries([])
            reset()
            return;
        }

        /*if (population<800||population>1439323776) {
            setError("Smallest population is 800 and largest population is 1,439,323,776")
            setCountries([])
            return;
        }*/
        setError("")
        
        addCountry({
            "name": name,
            "population": population,
        })
        reset()
        //event.target.elements.countryName.value = ""
        //event.target.elements.population.value = ""
        populationExist=false
    }

    const countryInput=document.getElementsByName("country")[0]
    const handleCitizenSubmit = (data) => {
        //event.preventDefault();
        /*const citizenName = event.target.elements.citizenName.value
        const country = event.target.elements.country.value
        const job = event.target.elements.job.value
        const salary = event.target.elements.salary.value
        const weeklyHours = event.target.elements.weeklyHours.value*/

        data.country=countryInput.value
        const citizenName=data.citizenName
        const country=countryInput.value
        const job=data.job
        const salary =data.salary
        const weeklyHours=data.weeklyHours


        var isExist=false;
        countries.forEach((item)=>{
            if(item.name==country){
                isExist=true
            }
        })
        if(!isExist){
            setError("Country hasn't been added");
            setCountries([])
            reset()
            return;
        }

        /*if(job.length<3||job.length>40){
            setError("Job name needs to be between 3 and 40 characters and needs to be vslid");
            setCountries([])
        }

        if(salary<0||salary>1000000){
            setError("Job name needs to be between 3 and 40 characters and needs to be vslid");
            setCountries([])
        }

        if (weeklyHours <0 || weeklyHours > 100) {
            setError("Weekly hours needs to be a valid number")
            setCountries([])
            return;
        }*/
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
        reset2()
        /*event.target.elements.citizenName.value = ""
        event.target.elements.country.value = ""
        event.target.elements.job.value = ""
        event.target.elements.salary.value = ""
        event.target.elements.weeklyHours.value = ""*/
    } 
    
    /*const [update,setUpdate]=useState(<div>{countries.map((item)=>{
        return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
    })}</div>)*/
    const countryName=document.getElementsByName("countryName")[0]
    const population=document.getElementsByName("population")[0]
    var populationExist=false;
    const handleClick = geo => () => {
        setValue2("countryName",geo.name)
        var geos=geo.name.split(' ')
        var geoFirst=geos[0]
        possibleCountries.forEach((item)=>{
            var items=item.country.split(' ')
            var itemFirst=items[0]
            if(itemFirst==geoFirst){
                setValue2("population",item.population)
                if(items.length>1&&geos.length>1){
                    console.log(1)
                    if(items[1]==geos[1]){
                        console.log(geo)
                        console.log(item)
                        setValue2("population",item.population)
                        populationExist=true
                    }
                }
                else{
                    populationExist=true
                }
            }
        })
        if(!populationExist){
            population.value=""
        }
        setValue("country",geo.name)
    }

    return(
        <div className='container'>
            <h1>Country/Citizen Simulation</h1>
            <div className='left'>
                <h3>Add or Modify Countries</h3>
                <form onSubmit={handleSubmit(handleCountrySubmit)}>
                    <input placeholder='Name' {...register("countryName", { 
                        required: "Country name must be provided" 
                    })}></input><br/>

                    <input placeholder='Population' {...register("population", { 
                        required: "Population must be provided", 
                        max:{value:1439323776,message:'The largest population is 1,439,323,776'}, 
                        min:{valu:800, message: 'The smallest population is 800'} 
                    })}></input><br/>

                    {errors2.countryName && <p>{errors2.countryName?.message}</p>}
                    {errors2.population && <p>{errors2.population?.message}</p>}
                    <input type="submit"></input>
                </form>

                <h3>Add or Modify Citizens</h3>
                <form onSubmit={handleSubmit2(handleCitizenSubmit)}>
                    <input placeholder='Name' {...register2("citizenName", { 
                        required: "Citizen name must be provided"
                    })}></input><br/>

                    <input placeholder='Country' {...register2("country", { 
                        required: "Country name must be provided"
                    })}></input><br/>

                    <input placeholder='Job' {...register2("job", { 
                        required: "Job name must be provided", 
                        minLength:{value:6, message:'The minimum length is 6'}, 
                        maxLength:{value:40, message:'The maximum length is 40'
                    }})}></input><br/>

                    <input placeholder='Salary' {...register2("salary", { 
                        required: "Salary must be provided", 
                        min:{value:0,message:'The minimum is 0'}, 
                        max:{value:5000000,message:'The maximum is 5,000,000'
                    }})}></input><br/>

                    <input placeholder='Weekly Hours' {...register2("weeklyHours", { 
                        required: "Weekly Hours must be provided", 
                        min:{value:0,message:'The minimum is 0'}, 
                        max:{value:100,message:'The maximum is 100'
                    }})}></input><br/>

                    {errors.citizenName && <p>{errors.citizenName?.message}</p>}
                    {errors.country && <p>{errors.country?.message}</p>}
                    {errors.job && <p>{errors.job?.message}</p>}
                    {errors.salary && <p>{errors.salary?.message}</p>}
                    {errors.weeklyHours && <p>{errors.weeklyHours?.message}</p>}
                    <input type="submit"></input>
                </form>
            </div>

            <div className='right'>
                <div>{error}</div>
                <div>{countries.map((item)=>{
                    return <Country country={item} selectCountry={selectCountry} deleteCountry={deleteCountry} citiz={citizens}/>
                })}</div>
            </div>

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
        </div>
    )
}

export default WorldList;