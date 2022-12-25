function Citizen({ citizen, selectCitizen, deleteCitizen }){
    return(
        <div>
            <div onClick={() => { selectCitizen(citizen) }}>{citizen.name} - {citizen.job.name}</div>
            {citizen.selected && <button onClick={() => { deleteCitizen(citizen.id) }}>Delete</button>}
        </div>
    )
}

export default Citizen;