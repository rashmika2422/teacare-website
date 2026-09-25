import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../appointments.json');

const loadAppointments = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error("Error reading appointments.json:", err);
    }
    return [];
};

const saveAppointments = (appointments) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing to appointments.json:", err);
    }
};

export let appointmentInbox = loadAppointments();

export const addAppointment = (data) => {
    const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        status: 'Pending Review',
        ...data
    };
    appointmentInbox.unshift(newItem);
    saveAppointments(appointmentInbox);
    return newItem;
};

export const getAllAppointments = () => {
    appointmentInbox = loadAppointments();
    return appointmentInbox;
};

export const updateAppointmentStatus = (id, status) => {
    appointmentInbox = loadAppointments();
    const item = appointmentInbox.find(a => a.id === id);
    if (item) {
        item.status = status;
        saveAppointments(appointmentInbox);
        return item;
    }
    return null;
};