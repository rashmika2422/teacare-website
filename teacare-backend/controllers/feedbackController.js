import {
    addFeedback,
    getAllFeedback,
    getPublishedFeedback,
    removeFeedback,
    updateFeedbackStatus,
} from '../models/feedback.js';

export const createFeedback = async (req, res, next) => {
    const { name, email, rating, message } = req.body ?? {};
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (
        cleanName.length < 1 ||
        cleanName.length > 100 ||
        cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5 ||
        cleanMessage.length < 10 ||
        cleanMessage.length > 2000
    ) {
        return res.status(400).json({ success: false, error: 'Please provide a valid name, email, 1–5 star rating, and feedback between 10 and 2000 characters.' });
    }

    try {
        const item = addFeedback({
            name: cleanName,
            email: cleanEmail,
            rating,
            message: cleanMessage,
        });

        res.status(201).json({
            success: true,
            message: 'Feedback received.',
            item: { id: item.id, status: item.status },
        });
    } catch (error) {
        next(error);
    }
};

export const listFeedback = (req, res, next) => {
    try {
        res.status(200).json(getAllFeedback());
    } catch (error) {
        next(error);
    }
};

export const listPublishedFeedback = (req, res, next) => {
    try {
        res.status(200).json(getPublishedFeedback());
    } catch (error) {
        next(error);
    }
};

export const changeFeedbackStatus = (req, res, next) => {
    const { status } = req.body ?? {};
    if (status !== 'Published' && status !== 'Pending Review') {
        return res.status(400).json({
            success: false,
            error: 'Status must be Published or Pending Review.',
        });
    }

    try {
        const item = updateFeedbackStatus(req.params.id, status);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Feedback not found.' });
        }
        return res.status(200).json({ success: true, item });
    } catch (error) {
        return next(error);
    }
};

export const deleteFeedback = (req, res, next) => {
    try {
        if (!removeFeedback(req.params.id)) {
            return res.status(404).json({ success: false, error: 'Feedback not found.' });
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
