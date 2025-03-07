import { GetStaticProps } from 'next';
import prisma from '../../../lib/prisma';
import { useEffect, useRef, useState } from 'react';
import { Button, Loader } from '@mantine/core';
import SuperJSON from 'superjson';
import { _Orphan, _User } from '../../../types';
import UserTable from '../../../components/users/UserTable';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { serverLink } from 'shared/links';

// * get orphans from database and pass the result as props to Index page.
export const getStaticProps: GetStaticProps = async () => {
	const users = await prisma.user.findMany({
		where: { type: { notIn: ['SPONSOR', 'GUARDIAN'] } },
		orderBy: { id: 'asc' },
	});

	const stringUsers = SuperJSON.stringify(users);
	return { props: { stringUsers } };
};

interface Props {
	stringUsers: string;
}
export default function Index({ stringUsers }: Props) {
	console.log('UsersList Index');
	const jsonUsers: _User[] = SuperJSON.parse(stringUsers);
	const [users, setUsers] = useState<_User[]>(jsonUsers);
	const [cardInfo, setCardInfo] = useState<_User>(jsonUsers[0]);
	const [hydration, setHydration] = useState(false);
	const updateCard = (user: _User) => setCardInfo(user);
	const router = useRouter();
	useEffect(() => {
		setUsers(SuperJSON.parse(stringUsers));
		setHydration(true);
	}, [hydration, stringUsers]);
	const printRef = useRef<typeof UserTable>(null);

	if (!hydration || !jsonUsers) return <Loader size={100} />;
	return (
		<div>
			<div className='text-center pb-4'>
				<Button size='xl' m={15} onClick={() => router.push(`${serverLink}users/action/create`)}>
					<IconPlus />
					Add User
				</Button>
			</div>
			<UserTable users={users} updateCard={updateCard} />
		</div>
	);
}
