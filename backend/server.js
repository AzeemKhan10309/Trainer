const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 5000;

const db = {
  users: [
    {
      id: 'trainer_001',
      role: 'trainer',
      name: 'Marcus Chen',
      email: 'marcus@fitpro.com',
      password: 'password123',
      avatar: null,
      specialization: 'Strength & Nutrition',
      clients: 12,
      rating: 4.9,
      experience: '8 years',
    },
    {
      id: 'client_001',
      role: 'client',
      name: 'Ahmed Al-Hassan',
      email: 'ahmed@email.com',
      password: 'password123',
      avatar: null,
      trainer: 'Marcus Chen',
      goal: 'Weight Loss',
      weight: 88,
      targetWeight: 78,
      startDate: '2024-01-15',
    },
  ],
  trainers: {
    trainer_001: {
      clients: ['client_001'],
      analytics: {
        totalClients: 12,
        activeClients: 9,
        avgCompliance: 87,
        revenue: 3600,
        monthlyRevenue: [2800, 3100, 2900, 3400, 3200, 3600],
      },
      dietPlans: [],
      workoutPlans: [],
    },
  },
  clients: {
    client_001: {
      dietPlan: null,
      workoutPlan: null,
      mealCompletions: [],
      exerciseCompletions: [],
      progress: [],
      checkIns: [],
      bodyMeasurements: [],
      messages: [],
    },
  },
  tokens: {},
};

function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  return send(res, 404, { success: false, message: 'Endpoint not found' });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

function createToken(user) {
  const token = `token_${user.id}_${Date.now()}`;
  db.tokens[token] = user.id;
  return token;
}

function authUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const userId = db.tokens[token];
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) || null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;

  if (pathname === '/health' && req.method === 'GET') {
    return send(res, 200, { success: true, service: 'fit-trainer-backend' });
  }

  if (!pathname.startsWith('/api/')) return notFound(res);

  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    const body = await parseBody(req);
    if (!body.email || !body.password || !body.role || !body.name) {
      return send(res, 400, { success: false, message: 'Missing required fields' });
    }
    const exists = db.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (exists) return send(res, 409, { success: false, message: 'Email already exists' });

    const id = `${body.role}_${String(Date.now()).slice(-6)}`;
    const user = {
      id,
      role: body.role,
      name: body.name,
      email: body.email,
      password: body.password,
      avatar: null,
      specialization: body.specialization || '',
      clients: 0,
      rating: 0,
      experience: body.experience || '',
      trainer: body.trainer || '',
      goal: body.goal || '',
      weight: Number(body.weight || 0),
      targetWeight: Number(body.targetWeight || 0),
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
    };

    db.users.push(user);
    if (user.role === 'trainer') {
      db.trainers[id] = { clients: [], analytics: { totalClients: 0, activeClients: 0, avgCompliance: 0, revenue: 0, monthlyRevenue: [] }, dietPlans: [], workoutPlans: [] };
    } else {
      db.clients[id] = { dietPlan: null, workoutPlan: null, mealCompletions: [], exerciseCompletions: [], progress: [], checkIns: [], bodyMeasurements: [], messages: [] };
    }

    return send(res, 201, { success: true, user: { ...user, password: undefined } });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const user = db.users.find((u) => u.email === body.email && u.password === body.password && u.role === body.role);
    if (!user) return send(res, 401, { success: false, message: 'Invalid credentials' });

    const token = createToken(user);
    return send(res, 200, { success: true, token, user: { ...user, password: undefined } });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '');
    delete db.tokens[token];
    return send(res, 200, { success: true });
  }

  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    const body = await parseBody(req);
    return send(res, 200, { success: true, message: `Reset link sent to ${body.email || 'email'}` });
  }

  if (pathname === '/api/auth/refresh' && req.method === 'POST') {
    const user = authUser(req);
    if (!user) return send(res, 401, { success: false, message: 'Unauthorized' });
    const token = createToken(user);
    return send(res, 200, { success: true, token });
  }

  if (pathname.startsWith('/api/users/') && req.method === 'GET') {
    const userId = pathname.split('/')[3];
    const user = db.users.find((u) => u.id === userId);
    if (!user) return send(res, 404, { success: false, message: 'User not found' });
    return send(res, 200, { success: true, user: { ...user, password: undefined } });
  }

  if (pathname.startsWith('/api/users/') && req.method === 'PATCH') {
    const userId = pathname.split('/')[3];
    const user = db.users.find((u) => u.id === userId);
    if (!user) return send(res, 404, { success: false, message: 'User not found' });
    const body = await parseBody(req);
    Object.assign(user, body);
    return send(res, 200, { success: true, user: { ...user, password: undefined } });
  }

  const trainerClientsMatch = pathname.match(/^\/api\/trainers\/([^/]+)\/clients$/);
  if (trainerClientsMatch && req.method === 'GET') {
    const trainerId = trainerClientsMatch[1];
    const clientIds = db.trainers[trainerId]?.clients || [];
    const clients = db.users.filter((u) => clientIds.includes(u.id)).map((u) => ({ ...u, password: undefined }));
    return send(res, 200, { success: true, clients });
  }

  if (trainerClientsMatch && req.method === 'POST') {
    const trainerId = trainerClientsMatch[1];
    const body = await parseBody(req);
    const client = db.users.find((u) => u.email === body.email && u.role === 'client');
    if (!client) return send(res, 404, { success: false, message: 'Client not found' });
    if (!db.trainers[trainerId]) return send(res, 404, { success: false, message: 'Trainer not found' });
    if (!db.trainers[trainerId].clients.includes(client.id)) db.trainers[trainerId].clients.push(client.id);
    return send(res, 200, { success: true, client: { ...client, password: undefined } });
  }

  const trainerAnalyticsMatch = pathname.match(/^\/api\/trainers\/([^/]+)\/analytics$/);
  if (trainerAnalyticsMatch && req.method === 'GET') {
    const trainerId = trainerAnalyticsMatch[1];
    const period = searchParams.get('period') || 'month';
    return send(res, 200, { success: true, period, analytics: db.trainers[trainerId]?.analytics || null });
  }

  const trainerDietPlansMatch = pathname.match(/^\/api\/trainers\/([^/]+)\/diet-plans$/);
  if (trainerDietPlansMatch && req.method === 'GET') {
    const trainerId = trainerDietPlansMatch[1];
    return send(res, 200, { success: true, plans: db.trainers[trainerId]?.dietPlans || [] });
  }
  if (trainerDietPlansMatch && req.method === 'POST') {
    const trainerId = trainerDietPlansMatch[1];
    const body = await parseBody(req);
    const plan = { id: `diet_${Date.now()}`, ...body };
    db.trainers[trainerId]?.dietPlans.push(plan);
    return send(res, 201, { success: true, plan });
  }

  const trainerWorkoutPlansMatch = pathname.match(/^\/api\/trainers\/([^/]+)\/workout-plans$/);
  if (trainerWorkoutPlansMatch && req.method === 'POST') {
    const trainerId = trainerWorkoutPlansMatch[1];
    const body = await parseBody(req);
    const plan = { id: `workout_${Date.now()}`, ...body };
    db.trainers[trainerId]?.workoutPlans.push(plan);
    return send(res, 201, { success: true, plan });
  }

  const clientDietPlanMatch = pathname.match(/^\/api\/clients\/([^/]+)\/diet-plan$/);
  if (clientDietPlanMatch && req.method === 'GET') {
    const clientId = clientDietPlanMatch[1];
    return send(res, 200, { success: true, plan: db.clients[clientId]?.dietPlan || null });
  }

  const clientWorkoutPlanMatch = pathname.match(/^\/api\/clients\/([^/]+)\/workout-plan$/);
  if (clientWorkoutPlanMatch && req.method === 'GET') {
    const clientId = clientWorkoutPlanMatch[1];
    return send(res, 200, { success: true, plan: db.clients[clientId]?.workoutPlan || null });
  }

  const mealCompletionMatch = pathname.match(/^\/api\/clients\/([^/]+)\/meal-completions$/);
  if (mealCompletionMatch && req.method === 'POST') {
    const clientId = mealCompletionMatch[1];
    const body = await parseBody(req);
    const item = { id: `meal_${Date.now()}`, ...body };
    db.clients[clientId]?.mealCompletions.push(item);
    return send(res, 201, { success: true, completion: item });
  }
  if (mealCompletionMatch && req.method === 'GET') {
    const clientId = mealCompletionMatch[1];
    const date = searchParams.get('date');
    const items = db.clients[clientId]?.mealCompletions || [];
    const filtered = date ? items.filter((m) => (m.completedAt || '').startsWith(date)) : items;
    return send(res, 200, { success: true, completions: filtered });
  }

  const exerciseCompletionMatch = pathname.match(/^\/api\/clients\/([^/]+)\/exercise-completions$/);
  if (exerciseCompletionMatch && req.method === 'POST') {
    const clientId = exerciseCompletionMatch[1];
    const body = await parseBody(req);
    const item = { id: `exercise_${Date.now()}`, ...body };
    db.clients[clientId]?.exerciseCompletions.push(item);
    return send(res, 201, { success: true, completion: item });
  }

  const clientProgressMatch = pathname.match(/^\/api\/clients\/([^/]+)\/progress$/);
  if (clientProgressMatch && req.method === 'POST') {
    const clientId = clientProgressMatch[1];
    const body = await parseBody(req);
    const entry = { id: `progress_${Date.now()}`, ...body };
    db.clients[clientId]?.progress.push(entry);
    return send(res, 201, { success: true, entry });
  }
  if (clientProgressMatch && req.method === 'GET') {
    const clientId = clientProgressMatch[1];
    return send(res, 200, { success: true, progress: db.clients[clientId]?.progress || [] });
  }

  const checkInsMatch = pathname.match(/^\/api\/clients\/([^/]+)\/check-ins$/);
  if (checkInsMatch && req.method === 'POST') {
    const clientId = checkInsMatch[1];
    const body = await parseBody(req);
    const checkIn = { id: `checkin_${Date.now()}`, ...body };
    db.clients[clientId]?.checkIns.push(checkIn);
    return send(res, 201, { success: true, checkIn });
  }

  const bodyMeasurementsMatch = pathname.match(/^\/api\/clients\/([^/]+)\/body-measurements$/);
  if (bodyMeasurementsMatch && req.method === 'POST') {
    const clientId = bodyMeasurementsMatch[1];
    const body = await parseBody(req);
    const measurement = { id: `measurement_${Date.now()}`, ...body };
    db.clients[clientId]?.bodyMeasurements.push(measurement);
    return send(res, 201, { success: true, measurement });
  }

  if (pathname === '/api/messages' && req.method === 'GET') {
    return send(res, 200, { success: true, messages: [] });
  }

  if (pathname === '/api/messages' && req.method === 'POST') {
    const body = await parseBody(req);
    return send(res, 201, { success: true, message: { id: `msg_${Date.now()}`, ...body } });
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});