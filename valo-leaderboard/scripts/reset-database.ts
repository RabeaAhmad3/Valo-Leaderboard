import { prisma } from '../src/lib/prisma';

async function resetDatabase() {
  console.log('Starting database reset...');
  
  try {
    // Delete all data in order (respecting foreign key constraints)
    console.log('Deleting all match player records...');
    await prisma.matchPlayer.deleteMany({});
    
    console.log('Deleting all matches...');
    await prisma.match.deleteMany({});
    
    console.log('Deleting all players...');
    await prisma.player.deleteMany({});
    
    console.log('Database reset complete!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();