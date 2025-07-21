import dayjs from "dayjs";
import { emailTemplates } from "./email-templete.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
	if (!to || !type) throw new Error('Missing required parameters');

	const templete = emailTemplates.find((t) => t.label === type);

	if (!templete) throw new Error('Invalid email type');

	const mailInfo = {
		userName: subscription.user.name,
		subscriptionName: subscription.name,
		renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
		planName: subscription.name,
		price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
		paymentMethod: subscription.paymentMethod,
	}

	const message = templete.generateBody(mailInfo);
	const subject = templete.generateSubject(mailInfo);

	const mailOptions = {
		from: accountEmail,
		to: to,
		subject: subject,
		html: message,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) console.log(error, 'Error sending email');

		console.log('Email sent: ' + info.response);
	})
}