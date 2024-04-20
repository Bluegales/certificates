import sqlite3 from 'sqlite3';

// Open the SQLite database
const db = new sqlite3.Database('database.db');

// Create the certificates table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS certificate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        cid TEXT,
        certificate_id INTEGER
    )`);
});

// Function to insert a certificate into the database
export function insertCertificate(email :string, eid: string, certificate_id: number) {
    db.serialize(() => {
        db.run(`INSERT INTO certificate (email, cid, certificate_id) VALUES (?, ?, ?)`,
            [email, eid, certificate_id],
            (err) => {
                if (err) {
                    console.error('Error inserting certificate:', err);
                } else {
                    console.log('Certificate inserted successfully');
                }
            });
    });
}

export function getCertificate(email: string, certificate_id: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM certificate WHERE email = ? AND certificate_id = ?`, [email, certificate_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
