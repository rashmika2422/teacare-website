import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = process.env.FEEDBACK_DATA_FILE
    ? path.resolve(process.env.FEEDBACK_DATA_FILE)
    : path.join(__dirname, '../feedback.json');

const loadFeedback = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const feedback = JSON.parse(data);
        if (!Array.isArray(feedback)) {
            throw new Error('feedback.json must contain a JSON array');
        }
        return feedback;
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

export const addFeedback = (data) => {
    const feedbackInbox = loadFeedback();
    const item = {
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        status: 'Pending Review',
        ...data,
    };

    feedbackInbox.unshift(item);
    fs.writeFileSync(DATA_FILE, JSON.stringify(feedbackInbox, null, 2), 'utf8');
    return item;
};

export const getAllFeedback = () => loadFeedback();

export const getPublishedFeedback = () =>
    loadFeedback()
        .filter((item) => item.status === 'Published')
        .map(({ id, timestamp, name, rating, message }) => ({
            id,
            timestamp,
            name,
            rating,
            message,
        }));

export const updateFeedbackStatus = (id, status) => {
    const feedbackInbox = loadFeedback();
    const item = feedbackInbox.find((feedback) => feedback.id === id);
    if (!item) return null;

    item.status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(feedbackInbox, null, 2), 'utf8');
    return item;
};

export const removeFeedback = (id) => {
    const feedbackInbox = loadFeedback();
    const updatedInbox = feedbackInbox.filter((item) => item.id !== id);
    if (updatedInbox.length === feedbackInbox.length) return false;

    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedInbox, null, 2), 'utf8');
    return true;
};
