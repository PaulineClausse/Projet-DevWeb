const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: 'mysql', // ou 'localhost' selon si tu exécutes dans Docker ou pas
    user: 'authuser',
    password: 'Authpassword1!!',
    database: 'authdb'
  });

   const [CheckUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
  if (CheckUsers[0].count > 0) {
    console.log('Users already seeded. Skipping...');
    await connection.end();
    return;
  }

  const users = [
  { name: 'Dupont', first_name: 'Jean', username: 'jdupont', email: 'jean.dupont@email.com', password: 'password123', role: 'admin' },
  { name: 'Martin', first_name: 'Sophie', username: 'smartin', email: 'sophie.martin@email.com', password: 'securePass45', role: 'user' },
  { name: 'Bernard', first_name: 'Lucas', username: 'lbernard', email: 'lucas.bernard@email.com', password: 'strongPass78', role: 'moderateur' },
  { name: 'Leroy', first_name: 'Emma', username: 'eleroy', email: 'emma.leroy@email.com', password: 'superSecure99', role: 'user' },
  { name: 'Giraud', first_name: 'Hugo', username: 'hgiraud', email: 'hugo.giraud@email.com', password: 'passHugo21', role: 'admin' },
  { name: 'Fournier', first_name: 'Alice', username: 'afournier', email: 'alice.fournier@email.com', password: 'alicePass77', role: 'user' },
  { name: 'Roux', first_name: 'Thomas', username: 'troux', email: 'thomas.roux@email.com', password: 'gamingRoux123', role: 'moderateur' },
  { name: 'Morgane', first_name: 'Clara', username: 'cmorel', email: 'clara.morgane@email.com', password: 'claraLove99', role: 'user' },
  { name: 'Fabre', first_name: 'Nathan', username: 'nfabre', email: 'nathan.fabre@email.com', password: 'nathanSecret11', role: 'user' },
  { name: 'Lopez', first_name: 'Camille', username: 'clopez', email: 'camille.lopez@email.com', password: 'camilleTop56', role: 'admin' }
];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const [userResult] = await connection.execute(
      `INSERT INTO users (name, first_name, username, email, password) VALUES (?, ?, ?, ?, ?)`,
      [user.name, user.first_name, user.username, user.email, hashedPassword]
    );

    const userId = userResult.insertId;

    const [roleRows] = await connection.execute(
      `SELECT role_id FROM roles WHERE role_name = ?`,
      [user.role]
    );

    if (roleRows.length > 0) {
      const roleId = roleRows[0].role_id;
      await connection.execute(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [userId, roleId]
      );
    } else {
      console.warn(`Rôle \"${user.role}\" introuvable pour ${user.email}`);
    }
  }

  console.log("Utilisateurs et rôles insérés avec succès");
  await connection.end();
})();
