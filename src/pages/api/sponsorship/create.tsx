// CONNECT  DELETE  GET HEAD  OPTIONS PATCH POST  PUT TRACE
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { STATUS_CODE, REQUEST_METHODS, _User, _Sponsorship } from '../../../../types/types';
import { User, Prisma, Guardian, Sponsor, Sponsorship } from '@prisma/client';
// import formidable from 'formidable';
// import nextConnect from 'next-connect';
// export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === REQUEST_METHODS.POST) {
			const sponsorship: Sponsorship = req.body;
			sponsorship.sponsorId = Number(sponsorship.sponsorId);
			sponsorship.orphanId = Number(sponsorship.orphanId);
			const isSponsorshipExist = await prisma.sponsorship.findFirst({
				where: { orphanId: sponsorship.orphanId, isActive: true },
			});
			console.log('🚀 ~ file: create.tsx:17 ~ handler ~ sponsorship:', sponsorship);
			console.log('🚀 ~ file: create.tsx:17 ~ handler ~ isSponsorshipExist:', isSponsorshipExist);
			if (!isSponsorshipExist) {
				const newSponsorship = await prisma.sponsorship.create({ data: sponsorship });
				console.log('🚀 ~ file: create.tsx:21 ~ handler ~ newSponsorship:', newSponsorship);
				return res.end(res.status(STATUS_CODE.CREATED).json({ newSponsorship: newSponsorship }));
			} else {
				return res.status(STATUS_CODE.NOT_ACCEPTABLE).json({ msg: 'orphan has an active sponsorship.' });
			}
		}
	} catch (error) {
		console.log('🚀 ~ file: create.tsx:36 ~ handler ~ error:', error);
		return res.end(res.status(STATUS_CODE.BAD_REQUEST).json({ msg: error }));
	}
}
