const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// verification of email after signup
const sendVerificationEmail = async (email, username, emailotp, expiresAt) => {
  const formattedTime = new Date(expiresAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const msg = {
    to: email,
    from: 'abhayaviswakumar@gmail.com',
    subject: 'Welcome to Foodie! Verify your account',
    text: `Hi ${username}, Welcome to FoodieGo! 
               Please verify your account using this OTP: ${emailotp}
               This OTP will expire at ${formattedTime}
                          Thank you for joining us!
                                                        — Team Foodie`
  }
  try {
    await sgMail.send(msg)
    console.log('email sent')
  } catch (error) {
    console.log(error.message)
  }
}

// verification to reset password
const sendPasswordResetEmail = async (email, passwordotp ,expiresAt) => {
  const formattedTime = new Date(expiresAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const msg = {
    to: email,
    from: 'abhayaviswakumar@gmail.com',
    subject : "Password Reset OTP",
    html : `<p>Your OTP for password reset is <strong>${passwordotp}</strong>. It is valid for 10 minutes till ${formattedTime}</p>`
  }
  try {
    await sgMail.send(msg)
  } catch (error) {
     console.log(error.message)
  }
}

// Send payment email
const sendPaymentSuccessEmail = async (email, username, orderId) => {
  const msg = {
    to: email,
    from: 'abhayaviswakumar@gmail.com',
    subject: 'Payment Successful - Foodie',
    html: `
      <p>Hi ${username},</p>
      <p>Thank you for your order! Your payment was successful.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>Your delicious food is on its way!</p>
      <br/>
      <p>— Team Foodie</p>
    `,
  };
  try {
    await sgMail.send(msg);
    console.log('Payment success email sent');
  } catch (error) {
    console.log(error.message);
  }
};

// send mail after delivery
const sendDeliverySuccessEmail = async (email, username, orderId) => {
  const msg = {
    to: email,
    from: 'abhayaviswakumar@gmail.com',
    subject: 'Your Order Has Been Delivered - Foodie',
    html: `
      <p>Hi ${username},</p>
      <p>Your order <strong>${orderId}</strong> has been successfully delivered. We hope you enjoyed your meal!</p>
      <p>We'd love to hear your thoughts. Please take a moment to leave a review.</p>
      <br/><br/>
      <p>— Team Foodie</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Delivery success email sent');
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {sendVerificationEmail, sendPasswordResetEmail,sendPaymentSuccessEmail,sendDeliverySuccessEmail };
