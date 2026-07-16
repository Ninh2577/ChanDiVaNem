import prisma from '../config/db.js';

export const getAdCampaigns = async () => {
  const campaigns = await prisma.adCampaign.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return campaigns.map(c => {
    if (c.imageUrl === '/uploads/ads/northwest_travel.jpg') {
      return { ...c, imageUrl: '/public/images/taybac.png' };
    }
    if (c.imageUrl === '/uploads/ads/gift_viet.jpg') {
      return { ...c, imageUrl: '/public/images/taxua.png' };
    }
    return c;
  });
};

export const getActiveAdCampaigns = async () => {
  const now = new Date();
  const campaigns = await prisma.adCampaign.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    orderBy: { createdAt: 'desc' }
  });
  return campaigns.map(c => {
    if (c.imageUrl === '/uploads/ads/northwest_travel.jpg') {
      return { ...c, imageUrl: '/public/images/taybac.png' };
    }
    if (c.imageUrl === '/uploads/ads/gift_viet.jpg') {
      return { ...c, imageUrl: '/public/images/taxua.png' };
    }
    return c;
  });
};

export const createAdCampaign = async (data) => {
  return await prisma.adCampaign.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl,
      position: data.position,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      contractValue: parseFloat(data.contractValue) || 0,
      displayInterval: parseInt(data.displayInterval) || 5,
      isActive: data.isActive !== undefined ? data.isActive : true
    }
  });
};

export const updateAdCampaign = async (id, data) => {
  return await prisma.adCampaign.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl,
      position: data.position,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      contractValue: data.contractValue !== undefined ? parseFloat(data.contractValue) : undefined,
      displayInterval: data.displayInterval !== undefined ? parseInt(data.displayInterval) : undefined,
      isActive: data.isActive !== undefined ? data.isActive : undefined
    }
  });
};

export const deleteAdCampaign = async (id) => {
  return await prisma.adCampaign.delete({
    where: { id: parseInt(id) }
  });
};

export const trackView = async (id) => {
  return await prisma.adCampaign.update({
    where: { id: parseInt(id) },
    data: {
      viewCount: {
        increment: 1
      }
    }
  });
};

export const trackClick = async (id) => {
  return await prisma.adCampaign.update({
    where: { id: parseInt(id) },
    data: {
      clickCount: {
        increment: 1
      }
    }
  });
};
