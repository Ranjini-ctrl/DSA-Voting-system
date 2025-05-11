// Global variables
const STORAGE_KEY = 'dsaVotingSystem';
const ADMIN_ROLL = 'ADMIN123'; // Special roll number for admin access

// Initialize data structure if not exists
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            users: [],
            votes: [],
            candidates: {
                girls: [
                    { name: 'Rose', votes: 0 },
                    { name: 'Janani', votes: 0 },
                    { name: 'Keerthi', votes: 0 },
                    { name: 'NOTA', votes: 0 }
                ],
                boys: [
                    { name: 'Yazhan', votes: 0 },
                    { name: 'Amrish', votes: 0 },
                    { name: 'Ashwin', votes: 0 },
                    { name: 'NOTA', votes: 0 }
                ]
            }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
}

// Get data from storage
function getStorageData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Save data to storage
function saveStorageData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    if (isLoggedIn()) {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }
    return null;
}

// Check if user has already voted
function hasVoted(rollNumber) {
    const data = getStorageData();
    return data.votes.some(vote => vote.rollNumber === rollNumber);
}

// Display message
function showMessage(message, type = 'success') {
    // Remove any existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type} fade-in`;
    messageElement.textContent = message;
    
    // Get the main element and insert message at the top
    const main = document.querySelector('main');
    main.insertBefore(messageElement, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Redirect to page
function redirectTo(page) {
    window.location.href = page;
}

// Update user info display
function updateUserDisplay() {
    const userDisplayElement = document.getElementById('userDisplayName');
    if (userDisplayElement) {
        const currentUser = getCurrentUser();
        userDisplayElement.textContent = currentUser ? currentUser.username : '';
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    redirectTo('index.html');
}

// Calculate percentage
function calculatePercentage(votes, total) {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
}

// Initialize page based on current location
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize storage on any page
    initializeStorage();
    
    // Handle login page
    if (currentPage === 'index.html' || currentPage === '') {
        // If already logged in, redirect to voting page
        if (isLoggedIn()) {
            redirectTo('voting.html');
            return;
        }
        
        // Set up login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value.trim();
                const year = document.getElementById('year').value;
                const rollNumber = document.getElementById('rollNumber').value.trim();
                
                if (!username || !year || !rollNumber) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                // Check if user already exists
                const data = getStorageData();
                const existingUser = data.users.find(user => user.rollNumber === rollNumber);
                
                if (!existingUser) {
                    // Add new user
                    const newUser = { username, year, rollNumber };
                    data.users.push(newUser);
                    saveStorageData(data);
                    
                    // Set current user in session
                    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
                    
                    showMessage('Login successful!');
                    setTimeout(() => redirectTo('voting.html'), 1000);
                } else {
                    // Check if names match
                    if (existingUser.username !== username) {
                        showMessage('Roll number already exists with a different name', 'error');
                        return;
                    }
                    
                    // Set current user in session
                    sessionStorage.setItem('currentUser', JSON.stringify(existingUser));
                    
                    showMessage('Welcome back!');
                    setTimeout(() => redirectTo('voting.html'), 1000);
                }
            });
        }
    }
    
    // Handle voting page
    else if (currentPage === 'voting.html') {
        // Check if user is logged in
        if (!isLoggedIn()) {
            redirectTo('index.html');
            return;
        }
        
        // Update user display
        updateUserDisplay();
        
        // Set up logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Check if user has already voted
        const currentUser = getCurrentUser();
        if (hasVoted(currentUser.rollNumber)) {
            showMessage('You have already voted. Redirecting to results...', 'error');
            setTimeout(() => redirectTo('results.html'), 2000);
            return;
        }
        
        // Set up voting form
        const votingForm = document.getElementById('votingForm');
        if (votingForm) {
            votingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const girlCandidate = document.querySelector('input[name="girlCandidate"]:checked');
                const boyCandidate = document.querySelector('input[name="boyCandidate"]:checked');
                
                if (!girlCandidate || !boyCandidate) {
                    showMessage('Please select one candidate from each category', 'error');
                    return;
                }
                
                const girlVote = girlCandidate.value;
                const boyVote = boyCandidate.value;
                
                // Record vote
                const data = getStorageData();
                
                // Update candidate vote counts
                data.candidates.girls.forEach(candidate => {
                    if (candidate.name === girlVote) {
                        candidate.votes++;
                    }
                });
                
                data.candidates.boys.forEach(candidate => {
                    if (candidate.name === boyVote) {
                        candidate.votes++;
                    }
                });
                
                // Record user's vote
                data.votes.push({
                    username: currentUser.username,
                    year: currentUser.year,
                    rollNumber: currentUser.rollNumber,
                    girlVote: girlVote,
                    boyVote: boyVote,
                    timestamp: new Date().toISOString()
                });
                
                // Save updated data
                saveStorageData(data);
                
                showMessage('Your vote has been recorded successfully!');
                setTimeout(() => redirectTo('results.html'), 1500);
            });
        }
    }
    
    // Handle results page
    else if (currentPage === 'results.html') {
        // Check if user is logged in
        if (!isLoggedIn()) {
            redirectTo('index.html');
            return;
        }
        
        // Update user display
        updateUserDisplay();
        
        // Set up logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Display results
        displayResults();
        
        // Set up back button
        const backToVotingBtn = document.getElementById('backToVotingBtn');
        if (backToVotingBtn) {
            backToVotingBtn.addEventListener('click', function() {
                redirectTo('voting.html');
            });
        }
    }
}

// Display voting results
function displayResults() {
    const data = getStorageData();
    const currentUser = getCurrentUser();
    
    // Calculate total votes
    const totalGirlVotes = data.candidates.girls.reduce((sum, candidate) => sum + candidate.votes, 0);
    const totalBoyVotes = data.candidates.boys.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    // Display girls results
    const girlsResultsElement = document.getElementById('girlsResults');
    if (girlsResultsElement) {
        girlsResultsElement.innerHTML = '';
        
        data.candidates.girls.forEach(candidate => {
            const percentage = calculatePercentage(candidate.votes, totalGirlVotes);
            
            const resultElement = document.createElement('div');
            resultElement.className = 'candidate-result';
            resultElement.innerHTML = `
                <div class="result-header">
                    <span class="candidate-name">${candidate.name}</span>
                    <span class="vote-count">${candidate.votes} votes (${percentage}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%">${percentage}%</div>
                </div>
            `;
            
            girlsResultsElement.appendChild(resultElement);
        });
    }
    
    // Display boys results
    const boysResultsElement = document.getElementById('boysResults');
    if (boysResultsElement) {
        boysResultsElement.innerHTML = '';
        
        data.candidates.boys.forEach(candidate => {
            const percentage = calculatePercentage(candidate.votes, totalBoyVotes);
            
            const resultElement = document.createElement('div');
            resultElement.className = 'candidate-result';
            resultElement.innerHTML = `
                <div class="result-header">
                    <span class="candidate-name">${candidate.name}</span>
                    <span class="vote-count">${candidate.votes} votes (${percentage}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%">${percentage}%</div>
                </div>
            `;
            
            boysResultsElement.appendChild(resultElement);
        });
    }
    
    // Display user's vote
    const userVoteDetailsElement = document.getElementById('userVoteDetails');
    if (userVoteDetailsElement) {
        const userVote = data.votes.find(vote => vote.rollNumber === currentUser.rollNumber);
        
        if (userVote) {
            userVoteDetailsElement.innerHTML = `
                <p><strong>Girls Category:</strong> ${userVote.girlVote}</p>
                <p><strong>Boys Category:</strong> ${userVote.boyVote}</p>
            `;
        } else {
            userVoteDetailsElement.innerHTML = '<p>You have not voted yet.</p>';
        }
    }
    
    // Display all votes (admin only)
    const adminSectionElement = document.getElementById('adminSection');
    if (adminSectionElement) {
        // Check if current user is admin
        if (currentUser.rollNumber === ADMIN_ROLL) {
            adminSectionElement.style.display = 'block';
            
            const voterListElement = document.getElementById('voterList');
            if (voterListElement) {
                voterListElement.innerHTML = '';
                
                if (data.votes.length === 0) {
                    voterListElement.innerHTML = '<p>No votes recorded yet.</p>';
                } else {
                    data.votes.forEach(vote => {
                        const voterElement = document.createElement('div');
                        voterElement.className = 'voter-item';
                        voterElement.innerHTML = `
                            <p><strong>${vote.username}</strong> (Year: ${vote.year}, Roll: ${vote.rollNumber})</p>
                            <p>Voted for: <strong>Girls</strong> - ${vote.girlVote}, <strong>Boys</strong> - ${vote.boyVote}</p>
                        `;
                        
                        voterListElement.appendChild(voterElement);
                    });
                }
            }
        } else {
            adminSectionElement.style.display = 'none';
        }
    }
    
    // Display winners
    displayWinners(data, totalGirlVotes, totalBoyVotes);
}

// Function to determine and display winners
function displayWinners(data, totalGirlVotes, totalBoyVotes) {
    const girlWinnerElement = document.getElementById('girlWinner');
    const boyWinnerElement = document.getElementById('boyWinner');
    
    if (girlWinnerElement && boyWinnerElement) {
        // Find girl winner
        let girlWinnerResult = determineWinner(data.candidates.girls);
        
        // Find boy winner
        let boyWinnerResult = determineWinner(data.candidates.boys);
        
        // Display girl winner
        if (girlWinnerResult.winner) {
            const girlPercentage = calculatePercentage(girlWinnerResult.winner.votes, totalGirlVotes);
            
            if (girlWinnerResult.isTie) {
                girlWinnerElement.innerHTML = `
                    <div class="winner-title">Girls Category</div>
                    <div class="winner-name">${girlWinnerResult.winner.name}</div>
                    <div class="winner-votes">${girlWinnerResult.winner.votes} votes</div>
                    <div class="winner-percentage">${girlPercentage}%</div>
                    <div class="winner-badge tie">TIE</div>
                    <div class="tie-note">There is a tie for first place</div>
                `;
            } else {
                girlWinnerElement.innerHTML = `
                    <div class="winner-title">Girls Category Winner</div>
                    <div class="winner-name">${girlWinnerResult.winner.name}</div>
                    <div class="winner-votes">${girlWinnerResult.winner.votes} votes</div>
                    <div class="winner-percentage">${girlPercentage}%</div>
                    <div class="winner-badge">WINNER</div>
                `;
            }
        } else {
            girlWinnerElement.innerHTML = `
                <div class="winner-title">Girls Category</div>
                <div class="no-winner">No votes recorded yet</div>
            `;
        }
        
        // Display boy winner
        if (boyWinnerResult.winner) {
            const boyPercentage = calculatePercentage(boyWinnerResult.winner.votes, totalBoyVotes);
            
            if (boyWinnerResult.isTie) {
                boyWinnerElement.innerHTML = `
                    <div class="winner-title">Boys Category</div>
                    <div class="winner-name">${boyWinnerResult.winner.name}</div>
                    <div class="winner-votes">${boyWinnerResult.winner.votes} votes</div>
                    <div class="winner-percentage">${boyPercentage}%</div>
                    <div class="winner-badge tie">TIE</div>
                    <div class="tie-note">There is a tie for first place</div>
                `;
            } else {
                boyWinnerElement.innerHTML = `
                    <div class="winner-title">Boys Category Winner</div>
                    <div class="winner-name">${boyWinnerResult.winner.name}</div>
                    <div class="winner-votes">${boyWinnerResult.winner.votes} votes</div>
                    <div class="winner-percentage">${boyPercentage}%</div>
                    <div class="winner-badge">WINNER</div>
                `;
            }
        } else {
            boyWinnerElement.innerHTML = `
                <div class="winner-title">Boys Category</div>
                <div class="no-winner">No votes recorded yet</div>
            `;
        }
    }
}

// Function to determine winner from a list of candidates
function determineWinner(candidates) {
    const result = {
        winner: null,
        isTie: false
    };
    
    if (!candidates || candidates.length === 0) return result;
    
    // Filter out NOTA and find the candidate with the most votes
    const realCandidates = candidates.filter(candidate => candidate.name !== 'NOTA');
    
    if (realCandidates.length === 0) return result;
    
    // Sort candidates by votes (descending)
    const sortedCandidates = [...realCandidates].sort((a, b) => b.votes - a.votes);
    
    // Check if there are any votes
    if (sortedCandidates[0].votes === 0) return result;
    
    // Check for a tie
    if (sortedCandidates.length > 1 && sortedCandidates[0].votes === sortedCandidates[1].votes) {
        result.isTie = true;
    }
    
    result.winner = sortedCandidates[0];
    return result;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);