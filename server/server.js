const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-here';

app.use(cors());
app.use(express.json());

// Database file paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');
const DRIVERS_FILE = path.join(__dirname, 'data', 'drivers.json');
const VEHICLES_FILE = path.join(__dirname, 'data', 'vehicles.json');

// Initialize data files
const initializeDataFiles = async () => {
  const dataDir = path.join(__dirname, 'data');
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  const files = [
    { path: USERS_FILE, data: [] },
    { path: BOOKINGS_FILE, data: [] },
    { path: DRIVERS_FILE, data: [] },
    { path: VEHICLES_FILE, data: [] },
  ];

  for (const file of files) {
    try {
      await fs.access(file.path);
    } catch {
      await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
    }
  }

  // Add default admin user if not exists
  const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
  const adminExists = users.find(user => user.email === 'admin@nomadcabs.com');
  
  if (!adminExists) {
    const adminUser = {
      id: uuidv4(),
      email: 'admin@nomadcabs.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      city: 'Mumbai',
      state: 'Maharashtra',
      isEmailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    const riderUser = {
      id: uuidv4(),
      email: 'rider@test.com',
      password: await bcrypt.hash('rider123', 10),
      firstName: 'Test',
      lastName: 'Rider',
      role: 'rider',
      city: 'Mumbai',
      state: 'Maharashtra',
      isEmailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    const driverUser = {
      id: uuidv4(),
      email: 'driver@test.com',
      password: await bcrypt.hash('driver123', 10),
      firstName: 'Test',
      lastName: 'Driver',
      role: 'driver',
      city: 'Mumbai',
      state: 'Maharashtra',
      isEmailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    users.push(adminUser, riderUser, driverUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
};

// Helper functions
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, city, state, phoneNumber } = req.body;

    const users = await readJsonFile(USERS_FILE);
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      city,
      state,
      phoneNumber,
      isEmailVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Booking Routes
app.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    const newBooking = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    await writeJsonFile(BOOKINGS_FILE, bookings);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bookings = await readJsonFile(BOOKINGS_FILE);
    const bookingIndex = bookings.findIndex(b => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();

    await writeJsonFile(BOOKINGS_FILE, bookings);
    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Driver Routes
app.post('/drivers', authenticateToken, async (req, res) => {
  try {
    const drivers = await readJsonFile(DRIVERS_FILE);
    const newDriver = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    drivers.push(newDriver);
    await writeJsonFile(DRIVERS_FILE, drivers);

    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/drivers', authenticateToken, async (req, res) => {
  try {
    const drivers = await readJsonFile(DRIVERS_FILE);
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Vehicle Routes
app.post('/vehicles', authenticateToken, async (req, res) => {
  try {
    const vehicles = await readJsonFile(VEHICLES_FILE);
    const newVehicle = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    vehicles.push(newVehicle);
    await writeJsonFile(VEHICLES_FILE, vehicles);

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/vehicles', authenticateToken, async (req, res) => {
  try {
    const vehicles = await readJsonFile(VEHICLES_FILE);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes
app.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await readJsonFile(USERS_FILE);
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/admin/users/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].status = status;
    users[userIndex].updatedAt = new Date().toISOString();

    await writeJsonFile(USERS_FILE, users);
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize server
const startServer = async () => {
  await initializeDataFiles();
  
  app.listen(PORT, () => {
    console.log(`🚀 Nomad Cabs API Server running on http://localhost:${PORT}`);
    console.log(`📊 Data files initialized in ./server/data/`);
    console.log(`🔑 Test Credentials:`);
    console.log(`   Admin: admin@nomadcabs.com / admin123`);
    console.log(`   Rider: rider@test.com / rider123`);
    console.log(`   Driver: driver@test.com / driver123`);
  });
};

startServer().catch(console.error);