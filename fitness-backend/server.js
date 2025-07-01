require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecrettoken123";
const axios =require("axios");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API läuft");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myfitnessapp",
});

db.connect((err) => {
  if (err) {
    console.log("Fehler bei der Verbindung", err);
  } else {
    console.log("Erfolgreich mit der Datenbank verbunden");
  }
});

//register backend
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  // Passwort hashen
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send("Fehler beim Hashen");
    }
    // SQL-Query zum Einfügen des neuen Users
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hash], (err, results) => {
      if (err) {
        return res.status(500).send("Datenbankfehler");
      }
      res.status(201).send("User registriert");
    });
  });
});

// Endpunkt zur Prüfung, ob ein Benutzername bereits vergeben ist
app.get("/check-username", (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ exists: false, message: "Kein Benutzername angegeben" });
  }
// SQL-Abfrage zum Prüfen, ob username existiert
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Fehler bei der DB-Abfrage:", err);
      return res.status(500).json({ exists: false, message: "Datenbankfehler" });
    }
      // Wenn Ergebnis vorhanden: Username ist vergeben
    if (results.length > 0) {
      return res.json({ exists: true }); // Benutzername gibts schon
    } else {
      return res.json({ exists: false }); // Benutzername ist frei
    }
  });
});


//Login backend
app.post("/login", (req, res) => {
  const { email, password } = req.body;
// SQL-Abfrage: Suche Benutzer mit der angegebenen E-Mail
  const sql = "SELECT * FROM users WHERE email = ?";
  // Datenbankanfrage
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send("Datenbankfehler");
    // Prüfen, ob ein Benutzer mit der E-Mail gefunden wurde
    if (results.length === 0)
      return res.status(401).send("E-Mail nicht gefunden");

    const user = results[0];
    // Passwort-Überprüfung: Vergleich mit gespeichertem Hash
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).send("Fehler beim Vergleichen");
      if (!match) return res.status(401).send("Falsches Passwort");

      // Passwort stimmt: JWT Token generieren
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "6h" }
      );

      
      res.status(200).json({
        message: "Login erfolgreich",
        token,
        username: user.username,
        level: user.level,
      });
    });
  });
});

// Middleware zum Authentifizieren
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token fehlt' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token ungültig' });
    req.user = user; 
    next();
  });
}

// Level setzen Endpoint
app.put('/user/level', authenticateToken, (req, res) => {
  const { level } = req.body;
  if (!level) {
    return res.status(400).json({ message: 'Level ist erforderlich' });
  }

  const sql = 'UPDATE users SET level = ? WHERE id = ?';
  db.query(sql, [level, req.user.id], (err, results) => {
    if (err) {
      console.error('Fehler beim Setzen des Levels:', err);
      return res.status(500).json({ message: 'Serverfehler' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }

    res.status(200).json({ message: 'Level erfolgreich gesetzt', level });
  });
});


app.get("/trainingsplan", (req, res) => {
  const { level, muscle_group_id } = req.query;

  if (!level) {
    return res.status(400).json({ message: "Level ist erforderlich" });
  }

  let sql = "SELECT * FROM exercises WHERE level = ?";
  const params = [level];

  if (muscle_group_id) {
    sql += " AND muscle_group_id = ?";
    params.push(muscle_group_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Datenbankfehler" });
    res.json(results);
  });
});
//videos aus der db holen
app.get("/videos",(req,res)=>{
db.query("SELECT id, name, video_url FROM exercises WHERE video_url IS NOT NULL", (err, results) => {
  if (err) return res.status(500).send(err);
  res.json(results);
});
});

//Progress-Bar Code für ständiges aktuallisieren der Daten

app.post('/api/progress/update', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 1. Aktuelles Level abfragen
  const levelSql = 'SELECT level, progress FROM users WHERE id = ?';
  db.query(levelSql, [userId], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ message: 'Fehler beim User-Check' });

    const { level, progress } = results[0];

    const levelTrainingDays = {
      beginner: 3,
      intermediate: 4,
      pro: 5
    };

    const requiredDays = levelTrainingDays[level];
    if (!requiredDays) return res.status(400).json({ message: 'Unbekanntes Level' });

    // 2. Zählen, wie viele erledigte Tage es gibt
    const sql = 'SELECT COUNT(*) AS count FROM trainingstage_progress WHERE user_id = ? AND completed = 1';
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Fehler beim Zählen' });

      const completedCount = results[0].count;

      // 3. Wenn alle Tage erledigt
      if (completedCount >= requiredDays) {
        const newProgress = Math.min(progress + 1, 100); // Optional: max 100%

        // 4. Fortschritt updaten & erledigte Tage zurücksetzen
        const updateSql = `
          UPDATE users SET progress = ? WHERE id = ?;
        `;
        db.query(updateSql, [newProgress, userId], (err) => {
          if (err) return res.status(500).json({ message: 'Fehler beim Fortschritt-Update' });

          // 5. Reset erledigte Tage
          const resetSql = 'UPDATE trainingstage_progress SET completed = 0 WHERE user_id = ?';
          db.query(resetSql, [userId], (err) => {
            if (err) return res.status(500).json({ message: 'Fehler beim Zurücksetzen' });
            return res.json({ progress: newProgress });
          });
        });
      } else {
        res.status(200).json({ message: 'Noch nicht alle Trainingstage erledigt' });
      }
    });
  });
});

//Api progress abrufen
app.get('/api/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT progress FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ message: 'Fehler beim Abrufen des Fortschritts' });

    res.json({ progress: results[0].progress });
  });
});

// Hilfsfunktion zum Fortschritt updaten
function updateProgress(userId, callback) {
  const levelSql = 'SELECT level, progress FROM users WHERE id = ?';
  db.query(levelSql, [userId], (err, results) => {
    if (err || results.length === 0) return callback({ status: 500, message: 'Fehler beim User-Check' });

    const { level, progress } = results[0];
    const levelTrainingDays = { beginner: 3, intermediate: 4, pro: 5 };
    const requiredDays = levelTrainingDays[level];
    if (!requiredDays) return callback({ status: 400, message: 'Unbekanntes Level' });

    const sql = 'SELECT COUNT(*) AS count FROM trainingstage_progress WHERE user_id = ? AND completed = 1';
    db.query(sql, [userId], (err, results) => {
      if (err) return callback({ status: 500, message: 'Fehler beim Zählen' });

      const completedCount = results[0].count;

      if (completedCount >= requiredDays) {
        const newProgress = Math.min(progress + 1, 100);

        const updateSql = 'UPDATE users SET progress = ? WHERE id = ?';
        db.query(updateSql, [newProgress, userId], (err) => {
          if (err) return callback({ status: 500, message: 'Fehler beim Fortschritt-Update' });

          const resetSql = 'UPDATE trainingstage_progress SET completed = 0 WHERE user_id = ?';
          db.query(resetSql, [userId], (err) => {
            if (err) return callback({ status: 500, message: 'Fehler beim Zurücksetzen' });

            callback(null, { progress: newProgress });
          });
        });
      } else {
        callback(null, { message: 'Noch nicht alle Trainingstage erledigt' });
      }
    });
  });
}

app.post('/api/trainingstag/complete', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { tag } = req.body;

  const sql = `
    INSERT INTO trainingstage_progress (user_id, tag, completed,date)
    VALUES (?, ?, 1,NOW())
    ON DUPLICATE KEY UPDATE completed = 1, date= NOW();
  `;

  db.query(sql, [userId, tag], (err) => {
    if (err) {
      console.error('Fehler beim Speichern des Trainingstags:', err);
      return res.status(500).json({ message: 'Fehler beim Speichern des Trainingstags' });
    }

    updateProgress(userId, (err, result) => {
      if (err) {
        return res.status(err.status).json({ message: err.message });
      }
      res.json(result);
    });
  });
});

app.get('/api/trainingstage/completed', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT tag FROM trainingstage_progress WHERE user_id = ? AND completed = 1';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Fehler beim Abrufen der erledigten Tage' });

    const tags = results.map(row => row.tag);
    res.json({ tags });
  });
});

app.put('/api/progress/reset', authenticateToken, (req, res) => {     //Progress reset
  const userId = req.user.id;

  const resetSql = 'UPDATE users SET progress = 0 WHERE id = ?';
  db.query(resetSql, [userId], (err) => {
    if (err) {
      console.error('Fehler beim Zurücksetzen des Fortschritts:', err);
      return res.status(500).json({ message: 'Fehler beim Zurücksetzen des Fortschritts' });
    }
    res.json({ message: 'Fortschritt erfolgreich zurückgesetzt' });
  });
});



const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
