export const config = {
  runtime: 'edge',
}

const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Rate Limiting (10 req / minute per IP)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limitWindow = 60000;
  
  if (ip !== 'unknown') {
    const record = rateLimitMap.get(ip);
    if (record) {
      if (now - record.timestamp < limitWindow) {
        if (record.count >= 10) {
          return new Response(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        record.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  try {
    const body = (await req.json()) as { name: string; email: string; message: string; cfToken: string }
    const { name, email, message, cfToken } = body

    if (!name || !email || !message || !cfToken) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Cloudflare Turnstile Validation
    const turnstileFormData = new FormData();
    turnstileFormData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    turnstileFormData.append('response', cfToken);
    turnstileFormData.append('remoteip', ip);
    
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileFormData
    });
    
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send Email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['vicevasquez95@gmail.com'],
        subject: `New message from ${name} via Portfolio`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Resend error:', res.status, errorText)
      throw new Error(`Resend error: ${res.statusText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
