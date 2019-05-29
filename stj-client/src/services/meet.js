import apiSvc from '../services/api';
import store from '../store';

const findMeetByID = (meets, meetId) => {
    return meets.find(meet => meet._id === meetId);
};

const findSessionByNumber = (sessions, sessNum) => {
    return  sessions.find(session => session.number === sessNum);
};

const MeetSvc = {
    findEventById(meet, eventId) {
        let event = false;

        if (meet && meet.events) {
            event = meet.events.find(ev => ev._id === eventId);
            if (event) {
                event.heats = [];
            }
        }
        return event;
    },

    findMeetByIdAndSessionNum (meets, meetId, sessNum) {
        const meet = findMeetByID(meets, meetId);
        let meetWithSession = false;

        if (meet) {
            const sess = findSessionByNumber(meet.sessions, sessNum);
            if (sess) {
                meetWithSession = {
                    name: meet.name, date: meet.date, _id: meet._id,
                    events: [],
                    session: { number: sess.number, name: sess.name, day: sess.day, time: sess.time }
                };
            }
        }
        return meetWithSession;
    }
};

export default MeetSvc;