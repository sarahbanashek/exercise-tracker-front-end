import './App.css';
import { useEffect, useState } from 'react';
import { Button, Divider, Heading, HStack, Spinner, VStack } from "@chakra-ui/react";
import { AddExerciseEvent } from './components/AddExerciseEvent';
import { DataAverages } from './components/DataAverages';
import { ViewRecentExerciseData } from './components/ViewRecentExerciseData';
import { ViewExerciseTypesData } from './components/ViewExerciseTypesData';
import { ViewAllWorkouts } from './components/ViewAllWorkouts';
import { DeleteExerciseEvents } from './components/DeleteExerciseEvents';
import { SuccessAlert } from './components/SuccessAlert';

const URL_BASE = 'http://localhost:3001';

export function App() {
  const [exerciseTypes, setExerciseTypes] = useState();
  const [averages, setAverages] = useState();
  const [last20, setLast20] = useState();
  const [loggedExerciseTypes, setLoggedExerciseTypes] = useState();
  const [loggedExerciseTimeSpent, setLoggedExerciseTimeSpent] = useState();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasSubmittedData, setHasSubmittedData] = useState(0);
  const [unusedExerciseTypes, setUnusedExerciseTypes] = useState();
  const [listAllExerciseEvents, setListAllExerciseEvents] = useState();
  const [showAddNewExerciseEvent, setShowAddNewExerciseEvent] = useState(false);
  const [showAllExerciseEvents, setShowAllExerciseEvents] = useState(false);
  const [showExerciseEventsToDelete, setShowExerciseEventsToDelete] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState({show: false});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetch(`${URL_BASE}/`, { method: 'GET', redirect: 'follow' });
        const dbData = await data.json();
        const avgs = {
          totalDuration: dbData.durationAvg,
          untilLastWeekDuration: dbData.untilLastWeekDurationAvg,
          totalHeartRate: dbData.heartRateAvg,
          untilLastWeekHeartRate: dbData.untilLastWeekHeartRateAvg
        };

        setAverages(avgs);
        setLast20(dbData.last20);
        setLoggedExerciseTypes([dbData.workoutTypeFrequencies, dbData.totalNumOfWorkouts]);
        setLoggedExerciseTimeSpent([dbData.workoutTypeTimeSpent, dbData.totalTimeAllWorkouts]);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [hasSubmittedData]);

  useEffect(() => {
    async function getAllWorkoutTypes() {
      try {
        const data = await fetch(`${URL_BASE}/add-exercise-event`, { method: 'GET', redirect: 'follow'});
        const dbData = await data.json();
        setExerciseTypes(dbData);
      } catch (error) {
        console.log(error);
      }
    }
    getAllWorkoutTypes();
  }, [hasSubmittedData])

  async function postNewExerciseEvent(eventData) {
    const response = await fetch(`${URL_BASE}/add-exercise-event`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });
      const parsedData = response.json();
      console.log(parsedData);

      setShowSuccessAlert({show: true, type: 'added workout'});
      setHasSubmittedData(hasSubmittedData + 1);
  }
  
  async function getUnusedExerciseTypes() {
    try {
      const data = await fetch(`${URL_BASE}/edit-exercise-types`, { method: 'GET', redirect: 'follow' });
      const dbData = await data.json();
      setUnusedExerciseTypes(dbData);
    } catch (error) {
      console.log(error);
    }
  }

  async function editExerciseTypesInDB(exerciseData) {
    const response = await fetch(`${URL_BASE}/edit-exercise-types`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exerciseData)
    });
    const parsedData = response.json();
    console.log(parsedData);

    setShowSuccessAlert({show: true, type: 'edited exercise types'});
    setHasSubmittedData(hasSubmittedData + 1);
  }

  async function getAllExerciseEvents() {
    try {
      const data = await fetch(`${URL_BASE}/edit-exercise-events`, { method: 'GET', redirect: 'follow' });
      const dbData = await data.json();
      setListAllExerciseEvents(dbData);
    } catch (error) {
      console.log(error);
    }
  }

  function toggleShowExerciseEvents(bool, option) {
    if (bool) {
      getAllExerciseEvents(); 
    }
    if (option === 'view') {
      setShowAllExerciseEvents(bool);
    } else if (option === 'delete') {
      setShowExerciseEventsToDelete(bool);
    }
  }

  async function deleteExerciseEvents(idsToDelete) {
    const response = await fetch(`${URL_BASE}/edit-exercise-events`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idsToDelete)
    });
    const parsedData = response.json();
    console.log(parsedData);

    setShowSuccessAlert({show: true, type: 'deleted workouts'});
    setHasSubmittedData(hasSubmittedData + 1);
  }


  return (
    !hasLoaded 
      ? 
      <HStack justify="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Heading size="lg">Loading</Heading>
      </HStack> 
      : 
      <div id="App">
        <VStack p={10} spacing={5}>
          <Heading>Exercise Tracker</Heading>
          {showSuccessAlert.show
            ? <SuccessAlert {...{showSuccessAlert, setShowSuccessAlert}} />
            : null
          }
          {showAddNewExerciseEvent && exerciseTypes
            ? <AddExerciseEvent {...{setShowAddNewExerciseEvent, exerciseTypes, postNewExerciseEvent, getUnusedExerciseTypes, unusedExerciseTypes, editExerciseTypesInDB}} />
            : <Button colorScheme="teal" onClick={() => setShowAddNewExerciseEvent(true)}>Add a New Workout</Button>
          }
          {showAllExerciseEvents && listAllExerciseEvents
            ? <ViewAllWorkouts {...{listAllExerciseEvents, toggleShowExerciseEvents}} />
            : <Button colorScheme="blue" onClick={() => toggleShowExerciseEvents(true, 'view')}>
                View Your Workout Log
              </Button>
          }
          {showExerciseEventsToDelete && listAllExerciseEvents
            ? <DeleteExerciseEvents {...{listAllExerciseEvents, toggleShowExerciseEvents, deleteExerciseEvents}} />
            : <Button colorScheme="pink" onClick={() => toggleShowExerciseEvents(true, 'delete')}>
                Delete a Workout From Your Log
              </Button>
          }
        </VStack>

        <Divider border="2px" borderColor="purple.100" />
        <DataAverages {...{averages}}/>
        <Divider border="2px" borderColor="purple.100" />

        <ViewRecentExerciseData {...{last20}} />

        <ViewExerciseTypesData {...{loggedExerciseTypes, loggedExerciseTimeSpent}} />
      </div>
  );
}
