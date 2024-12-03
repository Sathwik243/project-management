// Event listener for All Projects button
document.getElementById('allProjectsBtn').addEventListener('click', async () => {
    const projectList = document.getElementById('projectList');

    const myProjectList = document.getElementById('myProjectList');
    try {
        myProjectList.style.display = 'none';
        projectList.style.display = 'block';
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

document.getElementById('MyProjects').addEventListener('click', async () => {
    const projectList = document.getElementById('myProjectList');
    const allProjectList = document.getElementById('projectList');


    try {
        // Get the token from localStorage
        allProjectList.style.display = 'none';
        projectList.style.display = 'block';
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User not authenticated. Please log in.');
        }

        // Fetch all projects from the backend
        const response = await fetch('/api/projects/my-projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Send token in Authorization header
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            //throw new Error('Failed to fetch projects.');
        }

        // Parse the JSON response
        const projects = await response.json();
        alert("OK");
        // Clear the loading message
        projectList.innerHTML = ''; // Clear any existing content

// Check if there are no projects
if (projects.length === 0) {
    projectList.innerHTML = '<p>No projects found.</p>';
} else {
    // Display projects
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('my-project-item'); // Custom class with "my" prefix

        // Create the HTML structure for each project with a dropdown for details and an edit button
        projectElement.innerHTML = `
            <div class="my-project-content"> <!-- Custom class -->
                <h3 class="my-project-title"> <!-- Custom class -->
                    ${project.title}
                    <button class="my-dropdown-btn">Show Details</button> <!-- Custom class -->
                </h3>
                <div class="my-project-details"> <!-- Custom class -->
                    <p><strong>Topic Area:</strong> ${project.topicArea}</p>
                    <p><strong>Keywords:</strong> ${project.keyWords.join(', ')}</p>
                    <p><strong>Overview:</strong> ${project.overview}</p>
                    <p><strong>Objectives:</strong> ${project.objectives}</p>
                </div>
                <button class="my-edit-btn">Edit</button> <!-- Custom class -->
                <button class="my-button my-delete-button" onclick="deleteProject('${project.projectId}')">Delete</button>
            </div>
        `;

        // Append the project element to the project list
        projectList.appendChild(projectElement);

        // Initially hide the project details
        const details = projectElement.querySelector('.my-project-details');
        details.style.display = 'none';

        // Add event listener to toggle details visibility
        const dropdownBtn = projectElement.querySelector('.my-dropdown-btn');
        dropdownBtn.addEventListener('click', () => {
            const isVisible = details.style.display === 'block';
            details.style.display = isVisible ? 'none' : 'block';
            dropdownBtn.textContent = isVisible ? 'Show Details' : 'Hide Details';
        });

        // Add event listener to handle the edit button click
        const editBtn = projectElement.querySelector('.my-edit-btn');
        editBtn.addEventListener('click', () => {
            // Implement the edit functionality here, for example, open an edit form
            alert(`Edit functionality for project: ${project.title}`);
            showEditForm(project.projectId);
        });
    });
}

    } catch (error) {
        // Handle any errors during the fetch
        //projectList.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

// Function to show the edit form with project details
async function showEditForm(projectId) {
    try {
        const token = localStorage.getItem('token');
        // Fetch the project data by ID
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the user's token
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            //throw new Error('Failed to fetch project data');
        }

        // Get the project data
        const project = await response.json();
       console.log(project);
        // Populate the form with project data
       // Populate the form with project data
           document.getElementById('edit-title').value = project[0].title || ''; // Title
           document.getElementById('edit-topic-area').value = project[0].topicArea || ''; // Topic Area
        document.getElementById('edit-keywords').value = (project[0].keyWords || []).join(', '); // Keywords
document.getElementById('edit-overview').value = project[0].overview || ''; // Overview
document.getElementById('edit-objectives').value = project[0].objectives || ''; // Objectives


        // Show the edit modal
        document.getElementById('edit-form-modal').style.display = 'flex';

        // Attach project ID to the form
        document.getElementById('edit-form').dataset.projectId = projectId;
    } catch (error) {
       // console.error('Error fetching project data:', error);
    }
}

// Function to close the edit form modal
function closeEditForm() {
    document.getElementById('edit-form-modal').style.display = 'none';
}

// Handle the form submission to update the project
document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload

    // Get project ID from the dataset
    const projectId = event.target.dataset.projectId;

    // Gather updated project data from the form
    const updatedProjectData = {
        title: document.getElementById('edit-title').value,
        topicArea: document.getElementById('edit-topic-area').value,
        keyWords: document.getElementById('edit-keywords').value.split(',').map(kw => kw.trim()),
        overview: document.getElementById('edit-overview').value,
        objectives: document.getElementById('edit-objectives').value,
    };

    try {
        // Call the backend API to update the project
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Include token for authentication
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProjectData), // Send updated project data
        });

        if (!response.ok) {
            throw new Error('Failed to update project');
        }

        const result = await response.json();
        console.log('Project updated:', result);

        // Close the edit form modal
        closeEditForm();

        // Optionally, refresh the project list
        fetchProjects();
    } catch (error) {
        console.error('Error updating project:', error);
    }
});

// Example function to fetch projects (for refresh)
async function fetchProjects() {
    // Your logic to fetch and display projects
    console.log('Refreshing projects...');
}


async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return; // Exit if the user cancels
    }

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Include token for authentication
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }

        const result = await response.json();
        console.log(result.message);

        // Remove the project from the DOM
        const projectElement = document.querySelector(`[data-id="${projectId}"]`);
        if (projectElement) {
            projectElement.remove();
        }

        alert('Project deleted successfully');
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
    }
}

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

