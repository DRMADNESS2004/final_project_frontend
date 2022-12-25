function Citizen({ citizen, selectCitizen, deleteCitizen }){
    return(
        <div className='citizen'>
            <div onClick={() => { selectCitizen(citizen) }}>{citizen.name}</div>
            {citizen.selected && <div>
                <div>Job: {citizen.job.name}</div>
                <div>Salary: {citizen.job.salary}</div>
                <div>Weekly Hours: {citizen.job.weeklyHours}</div>
                {<button onClick={() => { deleteCitizen(citizen.id) }}>Delete</button>}
            </div>}
        </div>
    )
}

export default Citizen;