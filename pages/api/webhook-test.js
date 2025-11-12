// Тестов endpoint за проверка дали webhook пътят работи
export default async function handler(req, res) {
  console.log('Webhook test endpoint called');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  if (req.method === 'POST') {
    return res.status(200).json({ 
      success: true, 
      message: 'POST method accepted',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({ 
    error: 'Method not allowed', 
    method: req.method,
    allowed: ['POST']
  });
}

