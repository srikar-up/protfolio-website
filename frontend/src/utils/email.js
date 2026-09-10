// Helper to reliably open email on any browser / OS
export function handleEmailClick(e, email = 'srikarsensai@gmail.com', subject = 'Hello Srikar', body = '') {
  // If event exists, don't preventDefault so native mailto still has a chance if supported,
  // but open Gmail compose directly and immediately in a new tab without popup blocker delays.
  const encSub = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  const mailtoUrl = `mailto:${email}?subject=${encSub}&body=${encBody}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encSub}&body=${encBody}`;

  // Direct synchronous window.open in user-gesture event handler ensures popup blockers don't block it!
  try {
    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // If popup blocker intervened, fallback to location href mailto
      window.location.href = mailtoUrl;
    }
  } catch (err) {
    window.location.href = mailtoUrl;
  }
}
