const apiUrl = 'http://localhost:3000'; // Base URL of the API

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
        const generateButton = document.getElementById('generateCertificate');
        const downloadButton = document.getElementById('downloadCertificate');

        certificatesList.innerHTML = '';
        let anyCertificateAvailable = false;
        let anyCertificateCreated = false;

        data.forEach(cert => {
            const certElement = document.createElement('div');
            certElement.innerHTML = `<b>ID</b>: ${cert.id}<br> <b>Name</b>: ${cert.name}<br> <b>Description</b>: ${cert.description}<br> <b>Created</b>: ${cert.created ? 'Yes' : 'No'}`;
            certificatesList.appendChild(certElement);

            if (!cert.created) {
                anyCertificateAvailable = true;
            }
            if (cert.created) {
                anyCertificateCreated = true;
            }
        });

        // Enable or disable buttons based on certificate status
        generateButton.disabled = !anyCertificateAvailable;
        downloadButton.disabled = !anyCertificateCreated;

        // Optionally hide buttons instead of disabling them
        generateButton.classList.toggle('hidden', !anyCertificateAvailable);
        downloadButton.classList.toggle('hidden', !anyCertificateCreated);

        certificatesList.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to retrieve certificates: ' + error.message);
    });
}



function generateCertificate(certId) {
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
        console.log(data.message);
        document.getElementById('downloadCertificateButton').disabled = true;
        document.getElementById('generateCertificateButton').style.display = 'none';
        alert('Certificate generated successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error generating certificate: ' + error.message);
    });
}

function downloadCertificate(certId) {
    fetch(`${apiUrl}/certificate/0/download`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "certificate.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error downloading certificate: ' + error.message);
    });
}