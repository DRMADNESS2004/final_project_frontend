import Citizen from './Citizen';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Country({country, selectCountry, deleteCountry}){
    const [citizens, setCitizens] = useState([]);
    const [error, setError] = useState("");

    const loadCitizensFromAPI = () => {
        axios.get('http://localhost:8080/api/countries/'+country.id+'/citizens')
            .then((response) => {
                if (response.status === 200) {
                    setCitizens(response.data);
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    useEffect(() => {
        loadCitizensFromAPI();
    }, [citizens])

    const selectCitizen = (item) => {
        axios.put(('http://localhost:8080/api/citizens/'+item.id), {
            "name": item.name,
            "selected": !item.selected,
            "job": {
                "name": item.job.name,
                "salary": item.job.salary,
                "weeklyHours": item.job.weeklyHours
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    loadCitizensFromAPI()
                }
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    const deleteCitizen = (id) => {
        axios.delete('http://localhost:8080/api/citizens/' + id)
            .then((response) => {
                if (response.status === 200)
                    loadCitizensFromAPI()
            })
            .catch((error) => {
                setError(error.status + " error")
            })
    }

    return(
        <div className='country'>
            <div onClick={() => { selectCountry(country) }}>{country.name}</div>
            {country.selected && <div>
                <div>Population: {country.population} </div>
                <button onClick={() => { deleteCountry(country.id) }}>Delete</button>
                {country.selected && citizens.map((item) => {
                    return <Citizen citizen={item} selectCitizen={selectCitizen} deleteCitizen={deleteCitizen} />
                })}
                <div>{error}</div>
            </div>}
        </div>
    )
}

export default Country;