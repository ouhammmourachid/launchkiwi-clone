/// <reference path="../pb_data/types.d.ts" />

/**
 * Passwordless login: users sign in (and sign up) with a one-time code sent to
 * their email. Password auth is switched off for `users`; superusers keep theirs.
 * New accounts are still created with a random password because auth records
 * require one, but nobody ever sees or uses it.
 */

const OTP_EMAIL = {
  subject: "Your LaunchDunes sign-in code: {OTP}",
  body: `<p>Hi,</p>
<p>Your LaunchDunes sign-in code is:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px;margin:16px 0">{OTP}</p>
<p>It expires in 10 minutes. If you didn't try to sign in, you can ignore this email.</p>
<p>— The LaunchDunes team</p>`,
};

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.otp.enabled = true;
    users.otp.length = 6;
    users.otp.duration = 600;
    users.otp.emailTemplate.subject = OTP_EMAIL.subject;
    users.otp.emailTemplate.body = OTP_EMAIL.body;
    users.passwordAuth.enabled = false;
    app.save(users);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.otp.enabled = false;
    users.passwordAuth.enabled = true;
    app.save(users);
  },
);
