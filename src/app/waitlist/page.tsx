import { redirect } from 'next/navigation';

// The waitlist has been replaced by a personal "Book a demo" flow. Keep this route
// as a permanent redirect so old links, bookmarks, and indexed URLs still resolve.
export default function WaitlistRedirect() {
  redirect('/book-a-demo');
}
