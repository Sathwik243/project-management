// Function to search projects based on the query
async function searchProjects(query) {
  if (query.length < 3) {
    alert('Search query must be at least 3 characters long');
    return;
  }

  try {
    // API call to search projects
    const token = localStorage.getItem('token');

    const response = await fetch(`/api/students/search?query=${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Include token in Authorization header
      },
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    const projects = await response.json();
    displayProjects(projects); // Display results

  } catch (error) {
    console.error('Error searching projects:', error);
  }
}

// Event listener for search input
document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  const projectList = document.getElementById('projectList');
  projectList.style.display = 'none';
  searchProjects(query);
});

// Optional: Trigger search when user presses Enter in the search input
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    const projectList = document.getElementById('projectList');
  projectList.style.display = 'none';
    searchProjects(query);
  }
});

  // Function to display projects in the HTML
  // Function to display projects in the HTML
function displayProjects(projects) {
  const projectsList = document.getElementById('projects-list');
  projectsList.style.display = 'block';
  projectsList.innerHTML = ''; // Clear previous results


  if (projects.length === 0) {
      projectsList.innerHTML = '<p>No projects found.</p>';
      return;
  }

  projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project-item');

      // Create the HTML structure for each project with a dropdown for details
      projectElement.innerHTML = `
          <div class="project-content">
              <h3 class="project-title">
                  ${project.title}
                  <button class="dropdown-btn">Show Details</button>
              </h3>
              <div class="project-details">
                  <div>
                      <strong>Topic Area:</strong>
                      <p>${project.topicArea}</p>
                  </div>
                  <div>
                      <strong>Keywords:</strong>
                      <p>${project.keyWords.join(', ')}</p>
                  </div>
                  <div>
                      <strong>Overview:</strong>
                      <p>${project.overview}</p>
                  </div>
                  <div>
                      <strong>Objectives:</strong>
                      <p>${project.objectives}</p>
                  </div>
              </div>
          </div>
      `;

      // Append the project element to the project list
      projectsList.appendChild(projectElement);

      // Initially hide the project details
      const details = projectElement.querySelector('.project-details');
      details.style.display = 'none';

      // Add event listener to toggle details visibility
      const dropdownBtn = projectElement.querySelector('.dropdown-btn');
      dropdownBtn.addEventListener('click', () => {
          const isVisible = details.style.display === 'block';
          details.style.display = isVisible ? 'none' : 'block';
          dropdownBtn.textContent = isVisible ? 'Show Details' : 'Hide Details';
      });
  });
}


  document.getElementById('allProjectsBtn').addEventListener('click', async () => {
    const allProjectList = document.getElementById('projectList');
    allProjectList.style.display = 'block';
    const projectsList = document.getElementById('projects-list');
    projectsList.style.display = 'none';



    try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User not authenticated. Please log in.');
        }

        // Fetch all projects from the backend
        const response = await fetch('/api/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Send token in Authorization header
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch projects.');
        }

        // Parse the JSON response
        const projects = await response.json();
        alert("OK");
        // Clear the loading message

        console.log(projectList);
        projectList.innerHTML = '';

       // Check if there are no projects
if (projects.length === 0) {
    projectList.innerHTML = '<p>No projects found.</p>';
} else {
    // Display projects
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project-item');

        // Create the HTML structure for each project with a dropdown for details
        projectElement.innerHTML = `
            <div class="project-content">
                <h3 class="project-title">
                    ${project.title}
                    <button class="dropdown-btn">Show Details</button>
                </h3>
                <div class="project-details">
                    <p><strong>Topic Area:</strong> ${project.topicArea}</p>
                    <p><strong>Keywords:</strong> ${project.keyWords.join(', ')}</p>
                    <p><strong>Overview:</strong> ${project.overview}</p>
                    <p><strong>Objectives:</strong> ${project.objectives}</p>
                </div>
            </div>
        `;

        // Append the project element to the project list
        projectList.appendChild(projectElement);

        // Initially hide the project details
        const details = projectElement.querySelector('.project-details');
        details.style.display = 'none';

        // Add event listener to toggle details visibility
        const dropdownBtn = projectElement.querySelector('.dropdown-btn');
        dropdownBtn.addEventListener('click', () => {
            const isVisible = details.style.display === 'block';
            details.style.display = isVisible ? 'none' : 'block';
            dropdownBtn.textContent = isVisible ? 'Show Details' : 'Hide Details';
        });
    });
}

    } catch (error) {
        // Handle any errors during the fetch
      //  projectList.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
  

document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem('authToken'); // If token is stored in localStorage
    sessionStorage.removeItem('authToken'); // If token is stored in sessionStorage

    // Optionally clear other stored user data
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');

    // Redirect to the login page
    window.location.href = '/pages/index.html'; // Adjust the path to your login page
});
