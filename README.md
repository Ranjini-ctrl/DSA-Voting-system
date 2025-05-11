# DSA Department Voting System

A responsive and interactive web-based voting system for the DSA department, allowing students to vote for candidates in boys and girls categories.

## Features

- **User Authentication**: Login with username, year, and roll number
- **Candidate Selection**: Vote for one candidate from each category (boys and girls)
- **NOTA Option**: "None of the Above" option available for both categories
- **One-time Voting**: Each user can vote only once
- **Results Display**: 
  - View percentage of votes for each candidate
  - See your own voting choices
  - Admin view to see all votes (with special admin roll number)
- **Responsive Design**: Works on desktop and mobile devices

## Candidates

### Girls Category
- Rose
- Janani
- Keerthi
- NOTA (None of the Above)

### Boys Category
- Yazhan
- Amrish
- Ashwin
- NOTA (None of the Above)

## How to Use

1. **Login**: Enter your full name, year, and roll number on the login page
2. **Vote**: Select one candidate from each category and submit your vote
3. **View Results**: After voting, you'll be redirected to the results page where you can see:
   - Percentage of votes for each candidate
   - Your own voting choices
   - All votes (admin only)

## Admin Access

To access the admin view and see all votes:
- Login with any username and year
- Use roll number: `ADMIN123`

## Technical Details

- Built with HTML, CSS, and JavaScript
- Uses localStorage for data persistence
- No server-side components (client-side only)
- Responsive design for all device sizes

## File Structure

- `index.html` - Login page
- `voting.html` - Voting interface
- `results.html` - Results display
- `styles.css` - Styling for all pages
- `script.js` - Application logic
