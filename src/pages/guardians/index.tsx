import { GetStaticProps } from 'next';
import prisma from '../../../lib/prisma';
import { UserType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import SuperJSON from 'superjson';
import { _Guardian, _Orphan, _User } from '../../../types';
import MyModal from '../../../components/common/MyModal';
import { useDisclosure } from '@mantine/hooks';
import UserForm from '../../../components/users/UserForm';
import GuardianTable from '../../../components/guardians/GuardianTable';

// * get orphans from database and pass the result as props to Index page.
export const getStaticProps: GetStaticProps = async () => {
	// const guardians = await prisma.user.findMany({ where: { type: { equals: 'GUARDIAN' } }, include: { Guardian: true } });
	const guardians = await prisma.guardian.findMany({ include: { user: true } });
	console.log('🚀 ~ file: index.tsx:18 ~ constgetStaticProps:GetStaticProps= ~ guardians:', guardians);
	if (guardians.length > 0) {
		guardians.sort((a, b) => {
			return a.id > b.id ? 1 : -1;
		});
	}
	const stringGuardians = SuperJSON.stringify(guardians);
	return { props: { stringGuardians } };
};

interface Props {
	stringGuardians: string;
}
export default function Index({ stringGuardians }: Props) {
	console.log('GuardianList Index');
	const jsonGuardians: _Guardian[] = SuperJSON.parse(stringGuardians);
	const [guardians, setGuardians] = useState<_Guardian[]>(jsonGuardians);
	const [cardInfo, setCardInfo] = useState<_Guardian>(jsonGuardians[0]);
	const [hydration, setHydration] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	const updateCard = (guardians: _Guardian) => setCardInfo(guardians);
	useEffect(() => {
		setGuardians(SuperJSON.parse(stringGuardians));
		setHydration(true);
	}, [hydration, stringGuardians]);

	if (!hydration || !jsonGuardians) return <Loader size={100} />;
	return (
		<>
			{/* TODO pass a component with props to parent component */}
			<div className='text-center'>
				<MyModal
					ModelForm={<UserForm userType={UserType.GUARDIAN} close={close} />}
					modalTitle={'Add Guardian info'}
					buttonText={'Add New Guardian'}
					// open={open}
					// close={close}
					// opened={opened}
				/>
			</div>
			{/* <OrphanCard orphan={cardInfo as unknown as Orphan} /> */}
			<GuardianTable guardians={guardians} updateCard={updateCard} />
		</>
	);
}
