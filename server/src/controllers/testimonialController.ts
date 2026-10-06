import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CREATOR_TESTIMONIALS = [
  {
    id: 'creator-def-1',
    userName: 'Priya Sharma',
    role: 'Content Creator & SMM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Gained 45k followers in 30 days!',
    comment: 'The 1000+ Viral Reels Bundle saved me hundreds of hours! Top notch video quality and 100% functional templates.',
    verifiedPurchase: true,
    active: true,
    displayOrder: 1,
  },
  {
    id: 'creator-def-2',
    userName: 'Rohan Verma',
    role: 'Digital Agency Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'My secret vault for high-converting templates',
    comment: 'AffordPro is my go-to store for Canva templates and marketing courses. Instant drive access right after payment!',
    verifiedPurchase: true,
    active: true,
    displayOrder: 2,
  },
  {
    id: 'creator-def-3',
    userName: 'Ananya Patel',
    role: 'E-commerce Brand Founder',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Instant clarity & 100% working assets',
    comment: 'Super easy to download and customize. The Meta ads course and prompt pack gave my business immediate sales momentum.',
    verifiedPurchase: true,
    active: true,
    displayOrder: 3,
  },
  {
    id: 'creator-def-4',
    userName: 'Vikram Mehta',
    role: 'Freelance Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Outstanding quality and lifetime access',
    comment: 'The Canva bundle templates are super clean and easy to edit. Saved me so much time on client work!',
    verifiedPurchase: true,
    active: true,
    displayOrder: 4,
  },
  {
    id: 'creator-def-5',
    userName: 'Sneha Roy',
    role: 'Instagram Growth Coach',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Unbelievable value for creators',
    comment: 'High engagement reel templates that boost reach naturally. My clients love the content generated from these bundles.',
    verifiedPurchase: true,
    active: true,
    displayOrder: 5,
  },
  {
    id: 'creator-def-6',
    userName: 'Karan Malhotra',
    role: 'Performance Marketer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'ROAS increased dramatically',
    comment: 'The ad templates and AI prompts are tailored for high conversion rates. Best digital investment this year.',
    verifiedPurchase: true,
    active: true,
    displayOrder: 6,
  },
  {
    id: 'creator-def-7',
    userName: 'Neha Gupta',
    role: 'Small Business Owner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Fast instant download & zero hassle',
    comment: 'Got my download link right on screen and in my email. Templates work on free Canva accounts perfectly!',
    verifiedPurchase: true,
    active: true,
    displayOrder: 7,
  },
  {
    id: 'creator-def-8',
    userName: 'Rahul Deshmukh',
    role: 'Video Editor & Producer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Crisp 4K video clips & reels',
    comment: 'Ready-made cartoon food & viral reel bundles are top quality. No watermarks, easy to use right away.',
    verifiedPurchase: true,
    active: true,
    displayOrder: 8,
  },
  {
    id: 'creator-def-9',
    userName: 'Pooja Nair',
    role: 'Social Media Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Extremely helpful 24/7 support',
    comment: 'Had a quick question about unzipping files and support answered in 5 minutes. 100% recommended!',
    verifiedPurchase: true,
    active: true,
    displayOrder: 9,
  },
  {
    id: 'creator-def-10',
    userName: 'Amitav Sengupta',
    role: 'Course Creator & Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Complete digital ecosystem in one place',
    comment: 'From e-books to Canva kits, AffordPro delivers genuine value. Will definitely purchase again!',
    verifiedPurchase: true,
    active: true,
    displayOrder: 10,
  },
];

// Get all Creator Say testimonials (Real-time dynamic endpoint)
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    
    let dbTestimonials: any[] = [];
    try {
      dbTestimonials = await prisma.testimonial.findMany({
        where: { active: true },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        take: limit,
      });
    } catch (e) {
      console.warn('Testimonial DB Query notice:', e);
    }

    let result = [...dbTestimonials];
    if (result.length < limit) {
      const needed = limit - result.length;
      const fill = DEFAULT_CREATOR_TESTIMONIALS.slice(0, needed);
      result = [...result, ...fill];
    }

    res.json({
      success: true,
      total: result.length,
      testimonials: result.slice(0, limit),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new Creator Say testimonial (With Photo Upload support)
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, role, avatar, rating, title, comment, verifiedPurchase, displayOrder } = req.body;

    if (!userName || !comment) {
      res.status(400).json({ success: false, message: 'Customer Name and Comment are required' });
      return;
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        userName: userName.trim(),
        role: role ? role.trim() : 'Content Creator',
        avatar: avatar || undefined, // Photo URL or compressed base64 data URL
        rating: Number(rating) || 5,
        title: title ? title.trim() : 'Great Digital Assets',
        comment: comment.trim(),
        verifiedPurchase: verifiedPurchase !== false,
        active: true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    res.json({
      success: true,
      message: 'Creator review added successfully',
      testimonial: newTestimonial,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing Creator Say testimonial (With Photo Update support)
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { userName, role, avatar, rating, title, comment, verifiedPurchase, active, displayOrder } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(userName && { userName: userName.trim() }),
        ...(role !== undefined && { role: role.trim() }),
        ...(avatar !== undefined && { avatar }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(title !== undefined && { title: title.trim() }),
        ...(comment !== undefined && { comment: comment.trim() }),
        ...(verifiedPurchase !== undefined && { verifiedPurchase: Boolean(verifiedPurchase) }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    res.json({
      success: true,
      message: 'Creator review updated successfully',
      testimonial: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Creator Say testimonial
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.json({ success: true, message: 'Testimonial already deleted or not found', id });
      return;
    }

    await prisma.testimonial.delete({ where: { id } });

    res.json({ success: true, message: 'Creator review deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
