import nodemailer from 'nodemailer';

export function sendEmail(email: string, code: number) {
    // Use nodemailer or any other email sending library to send the code to the user's email
    // Example using nodemailer
    
    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: 'your_email@gmail.com', // Your email
    //         pass: 'your_password' // Your password
    //     }
    // });

    // const mailOptions = {
    //     from: 'your_email@gmail.com',
    //     to: email,
    //     subject: 'Login Code',
    //     text: `Your login code is: ${code}`
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
}
