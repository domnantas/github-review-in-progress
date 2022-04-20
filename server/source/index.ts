import {Server} from 'socket.io';

const io = new Server({
	cors: {
		origin: 'https://github.com',
	},
});

type PrPath = string;
type Username = string;
type Timestamp = number;

const userActivity: Map<PrPath, Map<Username, Timestamp>> = new Map();

interface Auth {
	username: string;
}

io.on('connection', socket => {
	const {username} = socket.handshake.auth as Auth;

	socket.on('join', async (prPath: PrPath) => {
		await socket.join(prPath);

		if (!userActivity.has(prPath)) {
			userActivity.set(prPath, new Map());
		}

		const prUserActivity = userActivity.get(prPath)!;

		prUserActivity.set(username, Date.now());

		const prUsers = [...prUserActivity.keys()];

		io.in(prPath).emit('users', prUsers);
		console.log(`${username} joined ${prPath}`);
		console.log(`List of users: ${prUsers}`);
	});
});

io.listen(3000);
