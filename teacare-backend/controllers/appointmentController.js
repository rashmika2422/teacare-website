import { addAppointment, getAllAppointments, updateAppointmentStatus } from '../models/appointment.js';
import { Resend } from 'resend';
import Sentiment from 'sentiment';

const sentimentEngine = new Sentiment();

export const createAppointment = async (req, res, next) => {
    console.log("DEBUG: createAppointment function started!");
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { name, company, email, eventType, message, date, timeSlot } = req.body;
        
        // Parse all admin notification emails from comma-separated env var
        const adminEmails = (process.env.NOTIFICATION_EMAILS || process.env.NOTIFICATION_EMAIL || '')
            .split(',')
            .map(e => e.trim())
            .filter(e => e.length > 0);

        console.log("DEBUG: Data received:", name, company, date, timeSlot);
        console.log("DEBUG: Will notify admin emails:", adminEmails);

        const mlResult = sentimentEngine.analyze(message || '');
        let priorityTier = mlResult.score > 2 ? '🟢 LOW PRIORITY' : mlResult.score < 0 ? '🔥 URGENT' : '🟡 MEDIUM PRIORITY';
        const priorityColor = mlResult.score > 2 ? '#2ecc71' : mlResult.score < 0 ? '#e74c3c' : '#f39c12';

        const savedItem = addAppointment({ name, company, email, eventType, message, date, timeSlot, priorityTier });
        console.log("DEBUG: Appointment/Inquiry added to model & saved to disk.");

        const isDirectorInquiry = date === 'N/A' || timeSlot === 'N/A';

        let adminEmailHtml = '';
        let adminSubject = '';
        let customerEmailHtml = '';
        let customerSubject = '';

        if (isDirectorInquiry) {
            adminSubject = `📩 [General Inquiry] - ${name} | ${eventType}`;
            adminEmailHtml = `
                <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #1a202c; padding: 25px; text-align: center; border-bottom: 3px solid #6c5ce7;">
                        <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 1px;">Teacare Events Pvt. Ltd.</h2>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">📩 General Inquiry Received</p>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">
                            <span style="font-size: 15px; font-weight: 600; color: #4a5568;">📩 New General Inquiry</span>
                            <span style="background-color: ${priorityColor}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${priorityTier}</span>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-top: 0; margin-bottom: 20px;">A client has submitted an inquiry directly to the board of directors. Specifications below:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c; width: 35%;">Client Name</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${name}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Email Address</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;"><a href="mailto:${email}" style="color: #6c5ce7; text-decoration: none;">${email}</a></td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Department</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${eventType}</td></tr>
                        </table>
                        <div style="background-color: #f8fafc; border-left: 4px solid #f39c12; padding: 15px 20px; border-radius: 4px;">
                            <h4 style="margin: 0 0 8px 0; color: #1a202c; font-size: 14px;">Inquiry Details</h4>
                            <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <div style="background-color: #f7fafc; padding: 15px 25px; text-align: center; border-top: 1px solid #edf2f7;">
                        <p style="color: #a0aec0; margin: 0; font-size: 11px;">Automated notification dispatched from Teacare Booking Core.<br>&copy; 2026 Teacare Events Pvt. Ltd. All rights reserved.</p>
                    </div>
                </div>
            `;

            customerSubject = `📩 Your Inquiry Has Been Received - Teacare Events Pvt. Ltd.`;
            customerEmailHtml = `
                <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #1a202c; padding: 25px; text-align: center; border-bottom: 3px solid #6c5ce7;">
                        <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 1px;">Teacare Events Pvt. Ltd.</h2>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">📩 General Inquiry Confirmation</p>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <h3 style="color: #1a202c; margin-top: 0; font-size: 18px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">Thank You, ${name}</h3>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-top: 20px; margin-bottom: 20px;">We have received your consultation inquiry. Details of your submission:</p>
                        <div style="background-color: #f8fafc; border-left: 4px solid #f39c12; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
                            <h4 style="margin: 0 0 8px 0; color: #1a202c; font-size: 14px;">Your Message</h4>
                            <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-bottom: 0;">A representative from our executive board of directors will review your inquiry and contact you within 24 business hours.</p>
                    </div>
                    <div style="background-color: #f7fafc; padding: 15px 25px; text-align: center; border-top: 1px solid #edf2f7;">
                        <p style="color: #a0aec0; margin: 0; font-size: 11px;">&copy; 2026 Teacare Events Pvt. Ltd. All rights reserved.</p>
                    </div>
                </div>
            `;
        } else {
            adminSubject = `📅 [Appointment Booking] - ${company} | ${eventType} | ${date} ${timeSlot}`;
            adminEmailHtml = `
                <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #1a202c; padding: 25px; text-align: center; border-bottom: 3px solid #f39c12;">
                        <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 1px;">Teacare Events Pvt. Ltd.</h2>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">📅 Appointment Booking Received</p>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">
                            <span style="font-size: 15px; font-weight: 600; color: #4a5568;">📅 New Appointment Booking</span>
                            <span style="background-color: ${priorityColor}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${priorityTier}</span>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-top: 0; margin-bottom: 20px;">A corporate representative has submitted an event brief and scheduled an appointment slot:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c; width: 35%;">Client Name</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${name}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Company Name</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${company}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Email Address</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;"><a href="mailto:${email}" style="color: #6c5ce7; text-decoration: none;">${email}</a></td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Event Type</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${eventType}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Preferred Date</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568; font-weight: 600;">${date}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Preferred Slot</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568; font-weight: 600;">${timeSlot}</td></tr>
                        </table>
                        <div style="background-color: #f8fafc; border-left: 4px solid #f39c12; padding: 15px 20px; border-radius: 4px;">
                            <h4 style="margin: 0 0 8px 0; color: #1a202c; font-size: 14px;">Event Objectives & Message</h4>
                            <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <div style="background-color: #f7fafc; padding: 15px 25px; text-align: center; border-top: 1px solid #edf2f7;">
                        <p style="color: #a0aec0; margin: 0; font-size: 11px;">Automated notification dispatched from Teacare Booking Core.<br>&copy; 2026 Teacare Events Pvt. Ltd. All rights reserved.</p>
                    </div>
                </div>
            `;

            customerSubject = `📅 Appointment Confirmed - ${date} at ${timeSlot} | Teacare Events`;
            customerEmailHtml = `
                <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="background-color: #1a202c; padding: 25px; text-align: center; border-bottom: 3px solid #f39c12;">
                        <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 1px;">Teacare Events Pvt. Ltd.</h2>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">📅 Appointment Booking Confirmed</p>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <h3 style="color: #1a202c; margin-top: 0; font-size: 18px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">Thank You, ${name}</h3>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-top: 20px; margin-bottom: 20px;">We have received your event planning request and scheduled your consultation slot. Details:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c; width: 35%;">Company Name</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${company}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Selected Event</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568;">${eventType}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Preferred Date</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568; font-weight: 600;">${date}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1a202c;">Preferred Slot</td><td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #4a5568; font-weight: 600;">${timeSlot}</td></tr>
                        </table>
                        <div style="background-color: #f8fafc; border-left: 4px solid #f39c12; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
                            <h4 style="margin: 0 0 8px 0; color: #1a202c; font-size: 14px;">Your Message / Objectives</h4>
                            <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-bottom: 0;">Our lead event coordinator will review your corporate requirements and contact you within 24 business hours.</p>
                    </div>
                    <div style="background-color: #f7fafc; padding: 15px 25px; text-align: center; border-top: 1px solid #edf2f7;">
                        <p style="color: #a0aec0; margin: 0; font-size: 11px;">&copy; 2026 Teacare Events Pvt. Ltd. All rights reserved.</p>
                    </div>
                </div>
            `;
        }

        if (adminEmails.length > 0 && process.env.RESEND_API_KEY) {
            await Promise.all(adminEmails.map(adminEmail =>
                resend.emails.send({
                    from: 'Teacare Events <onboarding@resend.dev>',
                    reply_to: adminEmails[0],
                    to: adminEmail,
                    subject: adminSubject,
                    html: adminEmailHtml
                })
            ));
        }

        if (email && process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: 'Teacare Events <onboarding@resend.dev>',
                    reply_to: adminEmails[0] || 'info@teacareevents.com',
                    to: email,
                    subject: customerSubject,
                    html: customerEmailHtml
                });
            } catch (err) {
                console.warn("Could not dispatch customer email:", err.message);
            }
        }

        res.status(200).json({ success: true, item: savedItem, message: 'Data saved and emails dispatched.' });
    } catch (error) { 
        console.error("--- EMAIL ERROR ---", error);
        next(error);
    }
};

export const getAppointments = (req, res, next) => {
    try {
        res.status(200).json(getAllAppointments());
    } catch (error) { next(error); }
};

export const updateAppointmentStatusController = (req, res, next) => {
    try {
        const { id, status } = req.body;
        const updated = updateAppointmentStatus(id, status);
        if (updated) {
            res.status(200).json({ success: true, item: updated });
        } else {
            res.status(404).json({ success: false, error: 'Item not found' });
        }
    } catch (error) { next(error); }
};

export const replyToAppointment = async (req, res, next) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { customerEmail, subject, replyText } = req.body;
        
        await resend.emails.send({
            from: 'Teacare Events <onboarding@resend.dev>',
            reply_to: process.env.NOTIFICATION_EMAIL || 'info@teacareevents.com',
            to: customerEmail,
            subject: subject || 'Reply from Teacare Events Administration',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1a202c;">
                    <h3>Message from TeaCare Administration</h3>
                    <p style="white-space: pre-wrap;">${replyText}</p>
                   </div>`
        });
        res.status(200).json({ success: true, message: 'Reply sent!' });
    } catch (error) { next(error); }
};