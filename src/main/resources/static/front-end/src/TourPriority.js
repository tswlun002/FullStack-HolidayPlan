import  './TourPriority.css'

const TourPriority = ({image, experiece, handleExperience})=> {
    const [experiece, setExperience] = useState('')

   
    return (
        <fieldset className="rate-visit">
                           <legend>Priority Levels</legend>
                           <input type="radio"  checked={experiece==="notExciting"} onChange={(event)=>{handleExperience(event)}} 
                             id="not-exciting" name={image} value="notExciting" className="not-exciting" />
                           <label htmlFor="not-exciting">First</label>
                           <input type="radio" checked={experiece==="exciting"}  onChange={(event)=>{handleExperience(event)}} 
                            id="exciting" name={image} value="exciting" className="exciting" />
                           <label htmlFor="exciting">Second</label>
                           <input type="radio" checked={experiece==="veryExciting"}  onChange={(event)=>{handleExperience(event)}} 
                           id="very-exciting" name={image} value="veryExciting" className="very-exciting" />
                           <label fohtmlForr="very-exciting">Third</label>

                    </fieldset> 
    )
}
export default TourPriority;