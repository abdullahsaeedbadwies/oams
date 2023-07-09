import { NextApiRequest, NextApiResponse } from 'next';
import { _ActivityInfo, _Orphan, Behavior, Education, REQUEST_METHODS, STATUS_CODE } from '../../../../types';
import prisma from '../../../../lib/prisma';
import { Prisma, UserType } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const admin = await prisma.user.findFirst({ where: { type: UserType.ADMIN } });
	const ID = Number(req.query.id);
	console.log('🚀 ~ file: [id].tsx:9 ~ handler ~ ID:', ID);
	if (!ID) return res.status(STATUS_CODE.BAD_REQUEST).json({ msg: 'Education info dose not exist.' });
	switch (req.method) {
		//* ************************UPDATE************************
		case REQUEST_METHODS.PUT: {
			try {
				const data: Education = req.body;

				const { id, Orphan, User, orphanId, userId, ...rest } = data;
				const updateEducation: Prisma.EducationInfoUpdateArgs = {
					data: {
						...rest,
						scoreSheet: null,
						Orphan: { connect: { id: orphanId } },
						User: { connect: { id: admin.id } },
					},
					where: { id: id },
				};

				const updatedEducation = await prisma.educationInfo.update(updateEducation);
				console.log('🚀 ~ file: [id].tsx:29 ~ handler ~ updatedEducation:', updatedEducation);
				return res
					.status(STATUS_CODE.OK)
					.json({ data: updatedEducation, msg: `Education with id:${updatedEducation.id} was update successfully` });
			} catch (error) {
				console.log('🚀 ~ file: [id].tsx:31 ~ handler ~ error:', error);
				return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ data: error, msg: 'Something went wrong.' });
			}
		}
		//* ************************DELETE************************

		case REQUEST_METHODS.DELETE: {
			try {
				const deletedEducation = await prisma.educationInfo.delete({ where: { id: ID } });
				console.log('🚀 ~ file: [id].tsx:43 ~ handler ~ deletedEducation:', deletedEducation);
				if (deletedEducation) {
					console.log('++++++++++++++++++++ at TRUE');

					return res.status(STATUS_CODE.OK).json({
						data: deletedEducation,
						msg: `Education with id: ${deletedEducation.id}  was deleted successfully.`,
					});
				} else {
					console.log('++++++++++++++++++++++++++ at else');
					return res.status(STATUS_CODE.BAD_REQUEST).json(`failed to delete Education info with id : ${ID}`);
				}
			} catch (error) {
				console.log('🚀 ~ file: [id].tsx:81 ~ handler ~ error:', error);
				console.log('+++++++++++++++++++++++++++++++++++ at catch error');

				return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ msg: 'Education dose not exist :', error: error });
			}
		}
		//* ************************GET************************
		case REQUEST_METHODS.GET: {
			console.log('getting education info');

			try {
				const requiredEducation = await prisma.educationInfo.findUnique({ where: { id: ID } });
				if (requiredEducation)
					return res.status(STATUS_CODE.OK).json({ data: requiredEducation, msg: 'Education Founded' });
				return res.status(STATUS_CODE.BAD_REQUEST).json(`Required Education not founded with id:${ID}`);
			} catch (error) {
				return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json('Some thing went wrong :' + error);
			}
		}
	}
}
