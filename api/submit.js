const { sql } = require('@vercel/postgres');

module.exports = async function handler(request, response) {
    // Enable CORS just in case
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

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Vercel automatically parses JSON bodies
        const { fullName, age, testScore } = request.body;

        if (!fullName || !age || !testScore) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into database
        const result = await sql`
            INSERT INTO requisitions (full_name, age, test_score)
            VALUES (${fullName}, ${age}, ${testScore})
            RETURNING *;
        `;

        return response.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Database Error:', error);
        
        // Return a helpful error message if the table doesn't exist
        if (error.message.includes('relation "requisitions" does not exist')) {
            return response.status(500).json({ 
                error: 'Database table not found. Please create the requisitions table in Vercel.',
                details: error.message 
            });
        }
        
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
