import sqlite3 from 'sqlite3';

// Open the SQLite database
const db = new sqlite3.Database('certificates.db');

// Create the certificates table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS certificate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        eid TEXT,
        certificate_id TEXT
    )`);
});

// Function to insert a certificate into the database
export function insertCertificateWithEid(eid: string, userId: string, certificateKind: string) {
    db.serialize(() => {
        db.run(`INSERT INTO certificate (user_id, eid, certificate_kind) VALUES (?, ?, ?)`,
            [userId, eid, certificateKind],
            (err) => {
                if (err) {
                    console.error('Error inserting certificate:', err);
                } else {
                    console.log('Certificate inserted successfully');
                }
            });
    });
}

export function getCertificatesByUserId(userId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM certificates WHERE user_id = ?`, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
