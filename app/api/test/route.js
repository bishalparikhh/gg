import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();

    // Fetch users from the 'users' collection with a limit of 10
    const users = await db.collection('users').find({}).limit(10).toArray();

    // Return the users with a 200 status
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Return error response in case of failure
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
