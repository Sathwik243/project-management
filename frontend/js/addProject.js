document.addEventListener('DOMContentLoaded', function () {
    // Get the form and its elements
    const form = document.getElementById('addProjectForm');
    const projectIdArea = document.getElementById('projectId');
    const titleInput = document.getElementById('title');
    const topicAreaInput = document.getElementById('topicArea');
    const keyWordsInput = document.getElementById('keyWords');
    const overviewInput = document.getElementById('overview');
    const objectivesInput = document.getElementById('objectives');
  
    // Form submit handler
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); // Prevent default form submission behavior
  
      // Gather form data
      const projectId = projectIdArea.value;
      const title = titleInput.value;
      const topicArea = topicAreaInput.value;
      const keyWords = keyWordsInput.value.split(',').map(keyword => keyword.trim());
      const overview = overviewInput.value;
      const objectives = objectivesInput.value;
  
      // Create the project data object without lecturerId and createdAt
      const projectData = {
        projectId,
        title,
        topicArea,
        keyWords,
        overview,
        objectives
      };
  
      try {
        // Send a POST request with the project data to the backend
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the JWT token is stored in localStorage
          },
          body: JSON.stringify(projectData), // Convert the project data to JSON
        });
  
        if (response.ok) {
          // If the project was successfully created
          const result = await response.json();
          alert('Project added successfully!');
          console.log(result);
          
          // Optionally, you could redirect or update the UI
          form.reset(); // Reset form fields after submission
        } else {
          // If the request failed
          const errorResult = await response.json();
          alert(`Error: ${errorResult.message}`);
        }
      } catch (error) {
        // Catch any network or other errors
        console.error('Error while submitting the project:', error);
        alert('An error occurred while adding the project. Please try again later.');
      }
    });
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem('authToken'); // If token is stored in localStorage
    sessionStorage.removeItem('authToken'); // If token is stored in sessionStorage

    // Optionally clear other stored user data
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');

    // Redirect to the login page
    window.location.href = 'pages/index.html'; // Adjust the path to your login page
});
  