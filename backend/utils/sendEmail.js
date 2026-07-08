const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if (!BREVO_API_KEY) {
            console.error("Brevo API key is not defined in environment variables");
            throw new Error("Brevo API key is not defined in environment variables");
        }

        const data = {
            sender: {
                name: "Real Estate Platform",
                email: process.env.EMAIL_USER
            },
            to: [{
                email: options.email
            }],
            subject: options.subject,
            htmlContent: options.message,
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error sending email:", result);
            throw new Error(`Error sending email: ${response.statusText}`);
        } else {
            console.log("Email sent successfully:", result.messageId);
        }

    } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("ERROR MESSAGE:", error.message);
        throw error;
    }
};

export default sendEmail;