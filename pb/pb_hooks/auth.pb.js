/// <reference path="../pb_data/types.d.ts" />

/**
 * Passwordless auth. There is no separate sign-up: asking for a code with an
 * email that has no account creates one, then the code is sent as usual.
 * Accounts stay unverified until the code is used (PocketBase marks the email
 * verified on a successful OTP sign-in).
 */
onRecordRequestOTPRequest((e) => {
  if (!e.record) {
    const email = String(e.requestInfo().body.email || "").trim().toLowerCase();
    // Readable default name from the address: "rachid.ouhammou@…" → "Rachid Ouhammou".
    const name = email
      .split("@")[0]
      .split(/[._+-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
      .slice(0, 60);

    const record = new Record(e.collection);
    record.setEmail(email); // save() validates the address
    record.set("name", name || "Maker");
    // Auth records require a password; password login is disabled for users.
    record.setPassword($security.randomString(32));
    e.app.save(record);
    e.record = record;
  }
  return e.next();
}, "users");

/**
 * Sign-in codes. Without SMTP configured (local development) PocketBase can't
 * email the one-time code, so print it to the PocketBase console instead of
 * failing the request. With SMTP on, codes are only ever emailed.
 */
onMailerRecordOTPSend((e) => {
  if (e.app.settings().smtp.enabled) return e.next();

  const email = e.record ? e.record.email() : "";
  console.log(`[dev] LaunchDunes sign-in code for ${email}: ${e.meta.password}`);
  e.app.logger().info("dev sign-in code (SMTP disabled)", "email", email, "otpId", e.meta.otpId);
});
