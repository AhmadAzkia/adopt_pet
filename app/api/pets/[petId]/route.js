import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const petId = (await params).petId;
    console.log('PUT request received for pet ID:', petId);

    const { adopted, owner_id } = await req.json();

    console.log('PET ID = ', petId);
    console.log('ADOPTED = ', adopted);
    console.log('OWNER ID = ', owner_id);

    if (!petId || adopted === undefined || !owner_id) {
      const errors = [];
      if (!petId) errors.push('Pet ID is required');
      if (adopted === undefined) errors.push('Adopted status is required');
      if (!owner_id) errors.push('Owner ID is required');

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: errors,
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // First, check if the pet belongs to the owner
      const [pets] = await connection.execute(
        'SELECT owner_id FROM pets WHERE id = ?',
        [petId]
      );

      if (pets.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Pet not found' },
          { status: 404 }
        );
      }

      if (pets[0].owner_id !== Number.parseInt(owner_id)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Update the pet's adoption status
      await connection.execute('UPDATE pets SET adopted = ? WHERE id = ?', [
        adopted ? 1 : 0,
        petId,
      ]);

      // Log the adoption status change
      await connection.execute(
        'INSERT INTO adopt_log (pet_id, owner_id, status_before, status_after) VALUES (?, ?, ?, ?)',
        [petId, owner_id, !adopted ? 1 : 0, adopted ? 1 : 0]
      );

      return NextResponse.json({
        success: true,
        message: 'Pet adoption status updated successfully',
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating pet adoption status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
