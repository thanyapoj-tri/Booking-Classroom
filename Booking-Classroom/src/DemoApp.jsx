import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events');
      setCurrentEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const handleDateSelect = async (selectInfo) => {
    let title = prompt('Please enter a new title for your event');
    let subtitle = prompt('Please enter a subtitle for your event');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      try {
        const newId = (currentEvents.length > 0 ? Math.max(...currentEvents.map(event => parseInt(event.id))) + 1 : 1).toString();
        const newEvent = {
          id: newId,
          title,
          subtitle, // Add the subtitle to the new event
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        };

        const response = await axios.post('http://localhost:3001/events', newEvent);
        if (response.status === 201) {
          fetchEvents(); // Fetch events again to get the updated list
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleEventClick = async (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      try {
        await axios.delete(`http://localhost:3001/events/${clickInfo.event.id}`);
        fetchEvents(); // Fetch events again to get the updated list
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEventDrop = async (dropInfo) => {
    const { id, start, end, allDay } = dropInfo.event;
    const { title, extendedProps: { subtitle } } = dropInfo.event;

    try {
      await axios.put(`http://localhost:3001/events/${id}`, {
        id,
        title,
        subtitle,
        start: start.toISOString(),
        end: end ? end.toISOString() : null,
        allDay
      });
      fetchEvents(); // Fetch events again to get the updated list
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventResize = async (resizeInfo) => {
    const { id, start, end, allDay } = resizeInfo.event;
    const { title, extendedProps: { subtitle } } = resizeInfo.event;

    try {
      await axios.put(`http://localhost:3001/events/${id}`, {
        id,
        title,
        subtitle,
        start: start.toISOString(),
        end: end ? end.toISOString() : null,
        allDay
      });
      fetchEvents(); // Fetch events again to get the updated list
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className='demo-app'>
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents} // load events from state
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventDrop={handleEventDrop} // Handle event drag and drop
          eventResize={handleEventResize} // Handle event resize
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      <br />
      <small>{eventInfo.event.extendedProps.subtitle}</small>
    </>
  );
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
      <br />
      <small>{event.subtitle}</small>
    </li>
  );
}
