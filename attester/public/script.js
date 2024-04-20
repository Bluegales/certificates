const apiUrl = 'http://localhost:3000/api'; // Base URL of the API

function checkLoggedIn() {
    fetch(`${apiUrl}/logged-in`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'logged in') {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('verifyForm').style.display = 'none';
            document.getElementById('userActions').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('verifyForm').style.display = 'none';
        document.getElementById('userActions').style.display = 'none';
    });
}

function login() {
    const email = document.getElementById('email').value;
    fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('verifyForm').style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
}

function verifyCode() {
    const code = document.getElementById('code').value;
    const parsedCode = parseInt(code, 10); // Parse the code as an integer

    if (isNaN(parsedCode)) {
        alert("Please enter a valid numeric code.");
        return;
    }

    console.log("Sending verification code:", parsedCode); // Log the code to ensure it's being captured correctly as an integer
    fetch(`${apiUrl}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: parsedCode }), // Send the code as an integer
        credentials: 'include' // Ensure cookies are included
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
        if (result.status === 200) {
            console.log("Verification successful:", result.body);
            document.getElementById('verifyForm').style.display = 'none';
            document.getElementById('userActions').style.display = 'block';
            // Add the listCertificates call here after verification is successful and UI is updated
            listCertificates();
        } else {
            throw new Error(`Failed to verify: ${result.body.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
        document.getElementById('verifyForm').style.display = 'block';
        document.getElementById('userActions').style.display = 'none';
    });
}

function enableDownloadButton() {
    const downloadButton = document.getElementById('downloadCertificateButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCertificate);
        downloadButton.disabled = false; // Make sure the button is enabled when it should be
    } else {
        console.error('Download button not found in the DOM');
    }
}

function logout() {
    // Clear session on server if necessary
    document.getElementById('userActions').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function listCertificates() {
    fetch(`${apiUrl}/certificate/available`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const certificatesList = document.getElementById('certificatesList');
        const generateButton = document.getElementById('generateCertificateButton');
        const downloadButton = document.getElementById('downloadCertificateButton');

        if (!certificatesList || !generateButton || !downloadButton) {
            console.error('One or more elements are not available in the DOM');
            return;
        }

        certificatesList.innerHTML = '';
        let generateVisible = false;
        let downloadVisible = false;

        data.forEach(cert => {
            const certElement = document.createElement('div');
            certElement.innerHTML = `<b>ID</b>: ${cert.id}<br><b>Name</b>: ${cert.name}<br><b>Description</b>: ${cert.description}<br><b>Created</b>: ${cert.created ? 'Yes' : 'No'}`;
            certificatesList.appendChild(certElement);

            if (!cert.created) {
                generateVisible = true;
            }
            if (cert.created) {
                downloadVisible = true;
            }
        });

        generateButton.style.display = generateVisible ? 'inline-block' : 'none';
        downloadButton.style.display = downloadVisible ? 'inline-block' : 'none';

        if (downloadVisible) {
            attachDownloadListener(); // Attach the event listener to the download button
        }

        certificatesList.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve certificates: ' + error.message);
    });
}

function attachDownloadListener() {
    const downloadButton = document.getElementById('downloadCertificateButton');
    downloadButton.onclick = downloadCertificate; // Ensure the download function is triggered on click
}



function generateCertificate() {
    fetch(`${apiUrl}/certificate/0/create`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Log the server message
        // Assuming the Download button needs to be enabled
        const downloadButton = document.getElementById('downloadCertificateButton');
        downloadButton.disabled = false; // Enable the Download button
        
        // Assuming you want to hide the Generate button after successful generation
        const generateButton = document.getElementById('generateCertificateButton');
        generateButton.style.display = 'none'; // Hide the Generate button

        alert('Certificate generated successfully.');

        // Optionally, refresh the list of certificates
        listCertificates(); // You might need to define or modify this function to suit this use case
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error generating certificate: ' + error.message);
    });
}


function downloadCertificate() {
    fetch(`${apiUrl}/certificate/0/download`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "certificate.pdf"; // Ensure this name matches your expected content
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL object
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error downloading certificate: ' + error.message);
    });
}
