const prisma = require('../lib/prisma');

// ─── Dashboard Stats ──────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalEducators,
      totalWebinars,
      totalStudyPlans,
      totalContent,
      totalMentorSessions,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: { in: ['educator', 'mentor'] } } }),
      prisma.webinar.count(),
      prisma.studyPlan.count(),
      prisma.content.count(),
      prisma.mentorSession.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalEducators,
        totalWebinars,
        totalStudyPlans,
        totalContent,
        totalMentorSessions,
      },
      recentUsers,
    });
  } catch (err) {
    console.error('Get dashboard stats failed:', err);
    return res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};

// ─── User Management ──────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get users failed:', err);
    return res.status(500).json({ error: 'Failed to load users' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot modify admin status' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updated,
    });
  } catch (err) {
    console.error('Toggle user status failed:', err);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
};

// ─── Content Management ───────────────────────
exports.getAllContent = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          type: true,
          difficulty: true,
          language: true,
          createdAt: true,
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.content.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      content,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get all content failed:', err);
    return res.status(500).json({ error: 'Failed to load content' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const contentId = parseInt(id);

    const content = await prisma.content.findUnique({ where: { id: contentId } });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await prisma.content.delete({ where: { id: contentId } });

    return res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (err) {
    console.error('Delete content failed:', err);
    return res.status(500).json({ error: 'Failed to delete content' });
  }
};

// ─── Webinar Management ──────────────────────
exports.getAllWebinars = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [webinars, total] = await Promise.all([
      prisma.webinar.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          topic: true,
          scheduledAt: true,
          durationMinutes: true,
          maxParticipants: true,
          createdAt: true,
          host: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
      }),
      prisma.webinar.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      webinars,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get all webinars failed:', err);
    return res.status(500).json({ error: 'Failed to load webinars' });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const { id } = req.params;
    const webinarId = parseInt(id);

    const webinar = await prisma.webinar.findUnique({ where: { id: webinarId } });
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    await prisma.webinar.delete({ where: { id: webinarId } });

    return res.status(200).json({
      success: true,
      message: 'Webinar deleted successfully',
    });
  } catch (err) {
    console.error('Delete webinar failed:', err);
    return res.status(500).json({ error: 'Failed to delete webinar' });
  }
};

// ─── Mentorship Management ───────────────────
exports.getAllMentorSessions = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { topic: { contains: search, mode: 'insensitive' } },
        { mentor: { name: { contains: search, mode: 'insensitive' } } },
        { student: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [sessions, total] = await Promise.all([
      prisma.mentorSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          status: true,
          topic: true,
          scheduledAt: true,
          durationMinutes: true,
          createdAt: true,
          mentor: {
            select: { id: true, name: true, email: true },
          },
          student: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.mentorSession.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      sessions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error('Get mentor sessions failed:', err);
    return res.status(500).json({ error: 'Failed to load mentor sessions' });
  }
};
