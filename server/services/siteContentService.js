import prisma from '../config/db.js';

export const getContent = async (key) => {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  if (!row) return null;
  return JSON.parse(row.value);
};

export const getAllContent = async () => {
  const rows = await prisma.siteContent.findMany();
  return rows.reduce((acc, r) => {
    acc[r.key] = JSON.parse(r.value);
    return acc;
  }, {});
};

export const upsertContent = async (key, value) => {
  const jsonStr = JSON.stringify(value);
  return await prisma.siteContent.upsert({
    where: { key },
    update: { value: jsonStr },
    create: { key, value: jsonStr }
  });
};
