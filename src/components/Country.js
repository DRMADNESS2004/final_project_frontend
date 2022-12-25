import Citizen from './Citizen';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Country({country, selectCountry, deleteCountry, citiz}){
    const [citizens, setCitizens] = useState([citiz]);
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
    }, [])

    const selectCitizen = (item) => {
        console.log(item)
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
        <div>
            {console.log()}
            <div onClick={() => { selectCountry(country) }}>{country.name} - {country.population}</div>
            {country.selected && <button onClick={() => { deleteCountry(country.id) }}>Delete</button>}
            {country.selected && citizens.map((item) => {
                return <Citizen citizen={item} selectCitizen={selectCitizen} deleteCitizen={deleteCitizen} />
            })}
        </div>
    )
}

export default Country;