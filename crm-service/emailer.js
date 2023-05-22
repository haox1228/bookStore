const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

exports.sendEmail = async (customer) => {
  const msg = {
    to: customer.userId,
    from: 'hma14@u.rochester.edu',
    subject: 'Activate your book store account',
    text: `Dear ${customer.name},
Welcome to the Book store created by haoxuanm.
Exceptionally this time we won’t ask you to click a link to activate your account.`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
