const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaazbazar');
  
  const User = require('./models/User');
  const Worker = require('./models/Worker');

  // Create admin
  const adminExists = await User.findOne({ email: 'admin@kaazbazar.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@kaazbazar.com', password: 'admin123', role: 'admin', isVerified: true });
    console.log('✅ Admin created: admin@kaazbazar.com / admin123');
  }

  // Sample workers
  const workerCount = await Worker.countDocuments();
  if (workerCount < 10) {
    const samples = [
      { name:'Rahim Mia', category:'Plumber', hourlyRate:300, location:{ district:'Dhaka' }, rating:4.8, totalReviews:42, totalJobs:85, isVerified:true, isFeatured:true, bio:'Expert plumber with 10+ years experience', skills:['Pipe repair','Water heater','Drainage'] },
      { name:'Karim Hossain', category:'Electrician', hourlyRate:350, location:{ district:'Chittagong' }, rating:4.9, totalReviews:68, totalJobs:120, isVerified:true, isFeatured:true, bio:'Certified electrician for home and office', skills:['Wiring','Solar','Generator'] },
      { name:'Shuvo Ahmed', category:'Carpenter', hourlyRate:400, location:{ district:'Dhaka' }, rating:4.7, totalReviews:35, totalJobs:60, isVerified:true, bio:'Custom furniture and woodwork expert' },
      { name:'Tania Begum', category:'Cleaner', hourlyRate:200, location:{ district:'Sylhet' }, rating:4.6, totalReviews:28, totalJobs:90, isVerified:true, bio:'Professional home and office cleaning' },
      { name:'Jahid Rahman', category:'Painter', hourlyRate:280, location:{ district:'Rajshahi' }, rating:4.5, totalReviews:20, totalJobs:45, isVerified:true, bio:'Interior and exterior painting specialist' },
    ];
    
    for (const w of samples) {
      const user = await User.create({ name: w.name, email: `${w.name.toLowerCase().replace(' ', '.')}@example.com`, password: 'password123', role: 'worker', district: w.location.district });
      await Worker.create({ ...w, user: user._id, isActive: true, phone: '+880 1700-000000', responseTime: '1-2 hours', languages: ['Bangla', 'English'] });
    }
    console.log('✅ Sample workers created');
  }

  console.log('✅ Database seeded!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
