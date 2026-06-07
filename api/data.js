const { sql } = require('@vercel/postgres');

module.exports = async function handler(request, response) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Fetch all rows from database
        const result = await sql`
            SELECT * FROM requisitions 
            ORDER BY created_at DESC;
        `;

        return response.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Database Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
