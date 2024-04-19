document.getElementById('loginButton').addEventListener('click', function() {
    // Hide the login page and show the main page
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    // Show the logout button after login
    document.getElementById('logoutButton').style.display = 'block';
});

document.getElementById('fetchResources').addEventListener('click', function() {
    fetch('https://api.example.com/resources')
        .then(response => response.json())
        .then(data => {
            const display = document.getElementById('resourceDisplay');
            display.innerHTML = JSON.stringify(data, null, 2);
        });
});

document.getElementById('generateDocument').addEventListener('click', function() {
    fetch('https://api.example.com/generate', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = data.downloadUrl;
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download Document';
        });
});

document.getElementById('logoutButton').addEventListener('click', function() {
    // Hide the main page and show the login page again
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    // Also hide the logout button
    document.getElementById('logoutButton').style.display = 'none';
});
