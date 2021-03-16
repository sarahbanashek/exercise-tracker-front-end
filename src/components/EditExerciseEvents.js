import { useState } from 'react';

export function EditExerciseEvents({listAllExerciseEvents, toggleShowExerciseEvents, deleteExerciseEvents}) {
    const [toDelete, setToDelete] = useState(new Map(listAllExerciseEvents.map(e => [e.id, false])));
    
    function formatDate(date) {
      const months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'Aug',
        '09': 'Sept',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      }
      const dateArr = date.split('-');
      return `${months[dateArr[1]]} ${parseInt(dateArr[2], 10)}, ${dateArr[0]}`;
    }
  
    function toggleDeleteWorkout(event, id) {
      event.preventDefault();
      const isSelected = toDelete.get(id);
      setToDelete(previous => new Map(previous).set(id, !isSelected));
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      const idsToDelete = [...toDelete.entries()].filter(([_, val]) => val).map(([key, _]) => key);
      deleteExerciseEvents(idsToDelete);
      toggleShowExerciseEvents(false);
    }
  
    return (
      <div id="delete-exercise-events-container">
        <input type="button" id="close-form" aria-label="close the delete workouts form" value="X" onClick={() => toggleShowExerciseEvents(false)} />
        <div className="form-title">Choose which workout(s) to delete</div>
        <form onSubmit={e => handleSubmit(e)}>
          <label htmlFor="select-workouts-to-delete" />
          <div id="select-workouts-to-delete">
            {listAllExerciseEvents.map(e =>
              <button key={'exercise-event-' + e.id} 
                      value={toDelete.get(e.id)} 
                      onClick={(event) => toggleDeleteWorkout(event, e.id)}
                      className={'delete-workout-button' + (toDelete.get(e.id) ? 'selected-workout' : '')} >
                <span>{formatDate(e.date)}</span>
                <span>{e.description}</span>
                <span>{e.duration} minutes</span>
                {e.heart_rate ? <span>{e.heart_rate} bpm</span> : null}
              </button>
              )}
            <input type="submit" id="submit-exercises-to-delete" value="Delete From Log" />
          </div>
        </form>
      </div> 
    );
  }