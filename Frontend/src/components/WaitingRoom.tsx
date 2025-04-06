import { Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function WaitingRoom({
	joinChat: joinChat,
}: {
	joinChat: (author: string, chatName: string) => void;
}) {
	const [author, setAuthor] = useState<string>();
	const [chatName, setChatName] = useState<string>();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!author || !chatName) return;

		joinChat(author, chatName);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex direction="column" gap={2}>
				<Input
					onChange={(e) => setAuthor(e.target.value)}
					placeholder="Author"
					name="author"
				/>
				<Input
					onChange={(e) => setChatName(e.target.value)}
					placeholder="Chat name"
					name="chatName"
				/>
				<Button type="submit">Start chat</Button>
			</Flex>
		</form>
	);
}
